from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List
from database import create_db_and_tables, get_session
from models import User, Lab, Booking
from auth import verify_password, create_access_token, get_password_hash
from datetime import timedelta

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=User)
def create_user(user: User, session: Session = Depends(get_session)):
    user.password_hash = get_password_hash(user.password_hash)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/labs/", response_model=List[Lab])
def read_labs(session: Session = Depends(get_session)):
    labs = session.exec(select(Lab)).all()
    return labs

@app.post("/labs/", response_model=Lab)
def create_lab(lab: Lab, session: Session = Depends(get_session)):
    session.add(lab)
    session.commit()
    session.refresh(lab)
    return lab

@app.get("/bookings/", response_model=List[Booking])
def read_bookings(session: Session = Depends(get_session)):
    bookings = session.exec(select(Booking)).all()
    return bookings

@app.post("/bookings/", response_model=Booking)
def create_booking(booking: Booking, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    # Simple check for token existence, real app would decode and get user
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking
