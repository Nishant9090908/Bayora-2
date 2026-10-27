"""
Seed script to initialize database tables and create initial role accounts.
"""
from app.database import engine, SessionLocal, Base
from app.models.user import User
from app.services.auth_service import hash_password

DEFAULT_USERS = [
    {
        "username": "red_operator",
        "password": "RedOperator2026!",
        "role": "red_team",
        "display_name": "Red Team Lead"
    },
    {
        "username": "blue_defender",
        "password": "BlueDefender2026!",
        "role": "blue_team",
        "display_name": "Blue Team Defense Architect"
    },
    {
        "username": "compliance_auditor",
        "password": "AuditorSecurity2026!",
        "role": "auditor",
        "display_name": "Lead Security Auditor"
    }
]

def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)

def seed_users():
    """Seed default accounts if they do not already exist."""
    init_db()
    db = SessionLocal()
    try:
        for u_data in DEFAULT_USERS:
            existing = db.query(User).filter(User.username == u_data["username"]).first()
            if not existing:
                user = User(
                    username=u_data["username"],
                    password_hash=hash_password(u_data["password"]),
                    role=u_data["role"],
                    display_name=u_data["display_name"]
                )
                db.add(user)
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
    print("Database initialized and users seeded successfully.")
