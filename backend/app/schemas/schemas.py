from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

# --- AUTH & USER ---
class LoginRequest(BaseModel):
    email: str
    password: str

class UserBase(BaseModel):
    name: str
    email: str
    mobile: Optional[str] = ""
    role_name: Optional[str] = "Executive"
    department: Optional[str] = "Sales"
    designation: Optional[str] = "Executive"
    status: Optional[str] = "Active"
    target_amount: Optional[float] = 1000000.0

class UserCreate(UserBase):
    password: str = "password123"

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime.datetime] = None
    class Config:
        from_attributes = True

# --- CRM ---
class LeadBase(BaseModel):
    name: str
    company_name: Optional[str] = ""
    email: Optional[str] = ""
    mobile: Optional[str] = ""
    source: Optional[str] = "Reference"
    stage: Optional[str] = "New Lead"
    assigned_user: Optional[str] = "Janabandhu Kampa"
    product_interest: Optional[str] = "Solar Power Solution"
    expected_value: Optional[float] = 0.0
    notes: Optional[str] = ""

class LeadCreate(LeadBase):
    pass

class LeadResponse(LeadBase):
    id: int
    lead_code: str
    created_at: Optional[datetime.datetime] = None
    class Config:
        from_attributes = True

class FollowUpCreate(BaseModel):
    lead_id: Optional[int] = None
    lead_code: Optional[str] = ""
    lead_name: str
    user_name: Optional[str] = "Janabandhu Kampa"
    followup_type: Optional[str] = "Call"
    followup_date: Optional[datetime.date] = None
    notes: Optional[str] = ""
    next_date: Optional[datetime.date] = None

class MeetingCreate(BaseModel):
    title: str
    client_name: str
    user_name: Optional[str] = "Janabandhu Kampa"
    meeting_date: datetime.date
    meeting_time: Optional[str] = "10:00 AM"
    location: Optional[str] = "Office"
    status: Optional[str] = "Scheduled"
    outcome: Optional[str] = ""

class QuotationItem(BaseModel):
    item_code: str
    name: str
    qty: float
    rate: float
    gst_rate: float
    amount: float

class QuotationCreate(BaseModel):
    customer_name: str
    company_name: Optional[str] = ""
    email: Optional[str] = ""
    mobile: Optional[str] = ""
    subtotal: float
    gst_rate: Optional[float] = 18.0
    gst_amount: float
    grand_total: float
    items_json: str = "[]"

class SalesOrderCreate(BaseModel):
    quote_no: Optional[str] = ""
    customer_name: str
    total_amount: float
    status: Optional[str] = "Pending"
    delivery_date: Optional[datetime.date] = None

# --- ERP & INVENTORY ---
class ProductBase(BaseModel):
    item_code: str
    name: str
    category: Optional[str] = "Finished Goods"
    uom: Optional[str] = "Pcs"
    unit_price: Optional[float] = 0.0
    cost_price: Optional[float] = 0.0
    current_stock: Optional[float] = 0.0
    min_level: Optional[float] = 5.0
    max_level: Optional[float] = 500.0
    warehouse: Optional[str] = "Balangir Warehouse"
    is_serialized: Optional[bool] = False
    barcode: Optional[str] = ""

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

class MaterialIssueCreate(BaseModel):
    project_id: str
    issued_to: str
    issue_type: Optional[str] = "Non-Returnable"
    product_id: int
    quantity: float
    notes: Optional[str] = ""

class PurchaseOrderCreate(BaseModel):
    vendor_name: str
    total_amount: float
    items_json: str = "[]"

class GRNCreate(BaseModel):
    po_no: str
    vendor_name: str
    vehicle_no: Optional[str] = ""
    gate_pass_no: Optional[str] = ""
    notes: Optional[str] = ""
    items_json: str = "[]"

# --- HRM ---
class ClockInRequest(BaseModel):
    user_name: str
    clock_in_time: Optional[str] = None

class ClockOutRequest(BaseModel):
    user_name: str
    clock_out_time: Optional[str] = None

class LeaveRequestCreate(BaseModel):
    user_name: str
    leave_type: str = "Casual Leave"
    from_date: datetime.date
    to_date: datetime.date
    total_days: int = 1
    reason: str

# --- AMC & COMPLAINTS ---
class AMCContractCreate(BaseModel):
    customer_name: str
    customer_mobile: Optional[str] = ""
    customer_email: Optional[str] = ""
    asset_name: str = "5kW Rooftop Solar System"
    contract_type: str = "Periodic"
    end_date: datetime.date
    total_amount: float = 12000.0
    total_visits: int = 4

class ComplaintTicketCreate(BaseModel):
    customer_name: str
    customer_mobile: str
    address: Optional[str] = ""
    product_name: str = "Solar Inverter"
    issue_description: str
    service_type: Optional[str] = "Chargeable"
    priority: Optional[str] = "Medium"
    assigned_technician: Optional[str] = "Unassigned"

class ComplaintOTPVerify(BaseModel):
    ticket_no: str
    otp_code: str
    resolution_notes: Optional[str] = ""

class SpareRequisitionCreate(BaseModel):
    ticket_no: str
    part_name: str
    quantity: int = 1
    requested_by: str

# --- ACCOUNTS ---
class DayBookCreate(BaseModel):
    entry_date: Optional[datetime.date] = None
    voucher_type: str = "Receipt"
    account_name: str = "Cash Account"
    party_name: str
    debit: Optional[float] = 0.0
    credit: Optional[float] = 0.0
    payment_mode: Optional[str] = "Bank"
    reference_no: Optional[str] = ""
    narration: Optional[str] = ""

class ExpenseCreate(BaseModel):
    category: str
    amount: float
    paid_to: str
    payment_mode: Optional[str] = "UPI"
    description: Optional[str] = ""

# --- PRODUCTION ---
class BOMCreate(BaseModel):
    product_name: str
    bom_type: Optional[str] = "EBOM"
    components_json: str = "[]"

class ProductionOrderCreate(BaseModel):
    so_no: str
    customer_name: str
    contact_person: Optional[str] = "sumit"
    technician: Optional[str] = "NA"
    order_value: float = 4000.0
    stage: Optional[str] = "Logistic/Warehouse"
