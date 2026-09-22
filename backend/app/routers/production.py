from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import BillOfMaterials, ProductionOrder
from backend.app.schemas.schemas import BOMCreate, ProductionOrderCreate
import random, datetime

router = APIRouter(prefix="/api/production", tags=["Production & Projects"])

@router.get("/bom")
@router.get("/boms")
def list_bom(db: Session = Depends(get_db)):
    return db.query(BillOfMaterials).all()

@router.post("/bom")
def create_bom(data: BOMCreate, db: Session = Depends(get_db)):
    bno = f"BOM-{random.randint(100, 999)}"
    bom = BillOfMaterials(
        bom_no=bno,
        product_name=data.product_name,
        bom_type=data.bom_type or "EBOM",
        status="Approved",
        components_json=data.components_json
    )
    db.add(bom)
    db.commit()
    db.refresh(bom)
    return bom

@router.get("/orders")
def list_production_orders(db: Session = Depends(get_db)):
    return db.query(ProductionOrder).order_by(ProductionOrder.id.desc()).all()

@router.post("/orders")
def create_production_order(data: ProductionOrderCreate, db: Session = Depends(get_db)):
    pno = f"PRJ-{random.randint(100, 999)}"
    po = ProductionOrder(
        so_no=data.so_no,
        project_no=pno,
        customer_name=data.customer_name,
        contact_person=data.contact_person,
        technician=data.technician,
        order_value=data.order_value,
        balance=data.order_value,
        status="Open Project",
        stage=data.stage or "Logistic/Warehouse"
    )
    db.add(po)
    db.commit()
    db.refresh(po)
    return po

@router.put("/orders/{order_id}/action")
def perform_project_action(order_id: int, action: str, db: Session = Depends(get_db)):
    """Handles: Start Project, Add To Finish Good, QC Check, Deliver Project, Installation, Close Project"""
    order = db.query(ProductionOrder).filter(ProductionOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if action == "start":
        order.status = "Open Project"
    elif action == "qc_pass":
        order.qc_status = "Passed"
    elif action == "add_fg":
        order.stage = "Technician"
    elif action == "deliver":
        order.stage = "Delivered"
    elif action == "install":
        order.technician_status = "Completed"
    elif action == "close":
        order.status = "Completed Project"
        order.close_date = datetime.date.today()
    
    db.commit()
    return {"message": f"Action '{action}' executed successfully", "current_status": order.status}
