/**
 * Bayora Backend - View Sanitization & Projection Service
 * Strips confidential opposing team intelligence before returning evaluation data.
 */

function sanitizeEvaluationForRole(evaluation, role) {
  let parsedRaw = {};
  try {
    parsedRaw = typeof evaluation.raw_data === 'string' 
      ? JSON.parse(evaluation.raw_data) 
      : (evaluation.raw_data || {});
  } catch (e) {
    parsedRaw = {};
  }

  let parsedPipeline = [];
  try {
    parsedPipeline = typeof evaluation.pipeline_steps === 'string'
      ? JSON.parse(evaluation.pipeline_steps)
      : (evaluation.pipeline_steps || []);
  } catch (e) {
    parsedPipeline = [];
  }

  const base = {
    id: evaluation.id,
    timestamp: evaluation.created_at,
    targetModel: evaluation.target_model,
    overallOutcome: evaluation.overall_outcome,
    safetyScore: parseFloat(evaluation.safety_score),
    attackSuccessRate: parseFloat(evaluation.attack_success_rate),
    latencyMs: evaluation.latency_ms,
    promptEvalCount: evaluation.prompt_eval_count ? parseInt(evaluation.prompt_eval_count, 10) : 0,
    evalCount: evaluation.eval_count ? parseInt(evaluation.eval_count, 10) : 0,
    provenanceHash: evaluation.provenance_hash,
    pipelineSteps: parsedPipeline
  };

  if (role === 'admin') {
    // Admin receives full unmasked data and provenance signature
    return {
      ...base,
      provenanceHash: evaluation.provenance_hash,
      rawAttackPrompt: parsedRaw.promptText,
      defensePolicyName: parsedRaw.defenseName,
      rawDefenseSystemPrompt: parsedRaw.defenseSystemPrompt,
      rawDefenseRegexes: parsedRaw.defenseRegexRules,
      modelResponse: parsedRaw.modelResponse || 'Refusal issued.',
      decision: evaluation.overall_outcome === 'BLOCKED' ? 'BLOCKED (Attack Neutralized)' : 'BYPASSED (Attack Successful)'
    };
  }

  if (role === 'red_team') {
    // Red Team View: attack prompt visible, Blue Team rules masked
    return {
      ...base,
      attackPrompt: parsedRaw.promptText,
      defensePolicyInfo: '[PROTECTED BLUE TEAM DEFENSE POLICY — INTERNAL RULES MASKED]',
      modelResponseSnippet: parsedRaw.modelResponseSnippet || 'Response evaluated by safety enclave.'
    };
  }

  if (role === 'blue_team') {
    // Blue Team View: defense rules visible, Red Team raw payload masked
    return {
      ...base,
      defensePolicyName: parsedRaw.defenseName || 'Configured Defense',
      defenseSystemPrompt: parsedRaw.defenseSystemPrompt || '[Defense Active]',
      attackCategory: parsedRaw.attackCategory || 'Adversarial Prompt Injection',
      rawAttackPayload: '[REDACTED RED TEAM ADVERSARIAL PAYLOAD — INTEL PROTECTED]',
      modelResponseSnippet: parsedRaw.modelResponseSnippet || 'Response evaluated by safety enclave.'
    };
  }

  return base;
}

module.exports = {
  sanitizeEvaluationForRole
};
