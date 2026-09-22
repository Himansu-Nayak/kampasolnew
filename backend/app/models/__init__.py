from backend.app.database import Base
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Date, Time, Boolean, Text, ForeignKey
)
from sqlalchemy.orm import relationship
import datetime

# --- USER & ACCESS CONTROL ---
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(200), default="")
    permissions = Column(Text, default="*")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    mobile = Column(String(20), default="")
    password = Column(String(200), default="password123")
    role_name = Column(String(50), default="Executive")
    department = Column(String(100), default="Sales")
    designation = Column(String(100), default="Executive")
    status = Column(String(20), default="Active")
    allowed_office_ip = Column(String(50), default="")
    hide_mobile = Column(Boolean, default=False)
    hide_email = Column(Boolean, default=False)
    target_amount = Column(Float, default=1000000.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserActivity(Base):
    __tablename__ = "user_activities"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), default="")
    action = Column(String(100), default="")
    module = Column(String(50), default="")
    details = Column(Text, default="")
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# --- CRM ---
class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    lead_code = Column(String(50), unique=True, index=True)
    name = Column(String(100), nullable=False)
    company_name = Column(String(150), default="")
    email = Column(String(100), default="")
    mobile = Column(String(20), default="")
    source = Column(String(50), default="Reference") # Reference, Calling, IndiaMart, Website
    stage = Column(String(50), default="New Lead")    # New Lead, Calling, Hold, Lost, Success
    assigned_user = Column(String(100), default="")
    product_interest = Column(String(150), default="Solar Power Solution")
    expected_value = Column(Float, default=0.0)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class FollowUp(Base):
    __tablename__ = "followups"
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    lead_code = Column(String(50), default="")
    lead_name = Column(String(100), default="")
    user_name = Column(String(100), default="")
    followup_type = Column(String(50), default="Call") # Call, WhatsApp, Email, Meeting
    followup_date = Column(Date, default=datetime.date.today)
    status = Column(String(50), default="Scheduled")   # Scheduled, Completed, Missed
    notes = Column(Text, default="")
    next_date = Column(Date, nullable=True)

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    lead_id = Column(Integer, nullable=True)
    client_name = Column(String(100), default="")
    user_name = Column(String(100), default="")
    meeting_date = Column(Date, default=datetime.date.today)
    meeting_time = Column(String(20), default="10:00 AM")
    location = Column(String(200), default="Office")
    status = Column(String(50), default="Scheduled") # Scheduled, Completed, Cancelled
    outcome = Column(Text, default="")

class Quotation(Base):
    __tablename__ = "quotations"
    id = Column(Integer, primary_key=True, index=True)
    quote_no = Column(String(50), unique=True, index=True)
    customer_name = Column(String(100), nullable=False)
    company_name = Column(String(150), default="")
    email = Column(String(100), default="")
    mobile = Column(String(20), default="")
    quote_date = Column(Date, default=datetime.date.today)
    subtotal = Column(Float, default=0.0)
    gst_rate = Column(Float, default=18.0)
    gst_amount = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)
    status = Column(String(50), default="In Process") # In Process, Approved, Rejected, Converted
    items_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SalesOrder(Base):
    __tablename__ = "sales_orders"
    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(50), unique=True, index=True)
    quote_no = Column(String(50), default="")
    customer_name = Column(String(100), nullable=False)
    order_date = Column(Date, default=datetime.date.today)
    total_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Pending") # Pending, Running, Hold, Completed, Invoiced
    delivery_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- ERP & INVENTORY ---
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String(50), unique=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), default="Finished Goods") # Raw Material, Semi Finished, Finished Goods, Tools, Consumables
    uom = Column(String(20), default="Pcs") # Pcs, Set, Mtr, Kg, Box
    unit_price = Column(Float, default=0.0)
    cost_price = Column(Float, default=0.0)
    current_stock = Column(Float, default=0.0)
    min_level = Column(Float, default=5.0)
    max_level = Column(Float, default=500.0)
    warehouse = Column(String(100), default="Balangir Warehouse")
    is_serialized = Column(Boolean, default=False)
    barcode = Column(String(50), default="")
    expiry_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StockTransaction(Base):
    __tablename__ = "stock_transactions"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    product_name = Column(String(150), default="")
    transaction_type = Column(String(50), nullable=False) # GRN, Sale, Material Issue, Branch Inward, Branch Outward, Adjustment
    quantity = Column(Float, nullable=False)
    balance_after = Column(Float, default=0.0)
    reference_no = Column(String(50), default="")
    warehouse = Column(String(100), default="Balangir Warehouse")
    notes = Column(String(200), default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(Integer, primary_key=True, index=True)
    po_no = Column(String(50), unique=True, index=True)
    vendor_name = Column(String(150), nullable=False)
    po_date = Column(Date, default=datetime.date.today)
    total_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Pending Approval") # Pending Approval, Approved, Received, Cancelled
    items_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class GoodsReceivedNote(Base):
    __tablename__ = "goods_received_notes"
    id = Column(Integer, primary_key=True, index=True)
    grn_no = Column(String(50), unique=True, index=True)
    po_no = Column(String(50), default="")
    vendor_name = Column(String(150), default="")
    grn_date = Column(Date, default=datetime.date.today)
    vehicle_no = Column(String(50), default="")
    gate_pass_no = Column(String(50), default="")
    status = Column(String(50), default="Accepted") # Inspected, Accepted, Rejected
    notes = Column(Text, default="")
    items_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DeliveryChallan(Base):
    __tablename__ = "delivery_challans"
    id = Column(Integer, primary_key=True, index=True)
    dc_no = Column(String(50), unique=True, index=True)
    order_no = Column(String(50), default="")
    customer_name = Column(String(100), default="")
    dc_date = Column(Date, default=datetime.date.today)
    vehicle_no = Column(String(50), default="")
    driver_name = Column(String(100), default="")
    status = Column(String(50), default="Approved") # Draft, Approved, Dispatched, Delivered
    items_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MaterialIssue(Base):
    __tablename__ = "material_issues"
    id = Column(Integer, primary_key=True, index=True)
    issue_no = Column(String(50), unique=True, index=True)
    project_id = Column(String(50), default="")
    issued_to = Column(String(100), default="")
    issue_type = Column(String(50), default="Non-Returnable") # Returnable, Non-Returnable, Inside, Outside
    issue_date = Column(Date, default=datetime.date.today)
    status = Column(String(50), default="Issued") # Issued, Returned, Consumed
    items_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- HRM ---
class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), nullable=False)
    user_type = Column(String(50), default="Company User")
    date = Column(Date, default=datetime.date.today)
    clock_in = Column(String(20), default="09:30 AM")
    clock_out = Column(String(20), default="06:30 PM")
    worked_hours = Column(Float, default=8.0)
    overtime_hours = Column(Float, default=0.0) # Always >= 0 (Bug fixed!)
    late_login = Column(Boolean, default=False)
    early_logout = Column(Boolean, default=False)
    status = Column(String(50), default="Present") # Present, Absent, OnLeave, Half Day
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), nullable=False)
    leave_type = Column(String(50), default="Casual Leave") # Casual, Sick, Privilege
    applied_date = Column(Date, default=datetime.date.today)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    total_days = Column(Integer, default=1)
    reason = Column(Text, default="")
    status = Column(String(50), default="Pending") # Pending, Approved, Rejected
    remarks = Column(String(200), default="")

class SalaryRecord(Base):
    __tablename__ = "salary_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(100), nullable=False)
    user_type = Column(String(50), default="Company User")
    month = Column(String(20), default="September")
    year = Column(Integer, default=2026)
    basic = Column(Float, default=25000.0)
    hra = Column(Float, default=10000.0)
    da = Column(Float, default=5000.0)
    conveyance = Column(Float, default=3000.0)
    special_allowance = Column(Float, default=2000.0)
    overtime_amount = Column(Float, default=0.0)
    pf_deduction = Column(Float, default=1800.0)
    esi_deduction = Column(Float, default=500.0)
    loan_emi = Column(Float, default=0.0)
    net_salary = Column(Float, default=42700.0)
    status = Column(String(50), default="Paid") # Draft, Approved, Paid
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class LoanRecord(Base):
    __tablename__ = "loan_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(100), nullable=False)
    principal_amount = Column(Float, default=50000.0)
    monthly_emi = Column(Float, default=5000.0)
    total_months = Column(Integer, default=10)
    paid_months = Column(Integer, default=2)
    remaining_balance = Column(Float, default=40000.0)
    status = Column(String(50), default="Active") # Active, Closed
    start_date = Column(Date, default=datetime.date.today)

# --- AMC ---
class AMCContract(Base):
    __tablename__ = "amc_contracts"
    id = Column(Integer, primary_key=True, index=True)
    contract_no = Column(String(50), unique=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_mobile = Column(String(20), default="")
    customer_email = Column(String(100), default="")
    asset_name = Column(String(150), default="5kW Rooftop Solar System")
    contract_type = Column(String(50), default="Periodic") # Periodic, Non-Periodic
    start_date = Column(Date, default=datetime.date.today)
    end_date = Column(Date, nullable=False)
    total_visits = Column(Integer, default=4)
    completed_visits = Column(Integer, default=1)
    total_amount = Column(Float, default=12000.0)
    status = Column(String(50), default="Active") # Active, Expired, Renewed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- COMPLAINTS & FIELD SERVICE ---
class ComplaintTicket(Base):
    __tablename__ = "complaint_tickets"
    id = Column(Integer, primary_key=True, index=True)
    ticket_no = Column(String(50), unique=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_mobile = Column(String(20), default="")
    address = Column(String(200), default="")
    product_name = Column(String(150), default="Solar Inverter 5kW")
    issue_description = Column(Text, nullable=False)
    service_type = Column(String(50), default="Chargeable") # Chargeable, Free, AMC, FOC, Warranty
    priority = Column(String(20), default="Medium")
    status = Column(String(50), default="New") # New, Open, Closed
    assigned_technician = Column(String(100), default="Unassigned")
    otp_code = Column(String(10), default="4829")
    is_otp_verified = Column(Boolean, default=False)
    resolution_notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

class SpareRequisition(Base):
    __tablename__ = "spare_requisitions"
    id = Column(Integer, primary_key=True, index=True)
    ticket_no = Column(String(50), nullable=False)
    part_name = Column(String(150), nullable=False)
    quantity = Column(Integer, default=1)
    requested_by = Column(String(100), default="")
    status = Column(String(50), default="Pending") # Pending, Approved, Issued, Rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- ACCOUNTS & FINANCIALS ---
class DayBookEntry(Base):
    __tablename__ = "day_book_entries"
    id = Column(Integer, primary_key=True, index=True)
    entry_date = Column(Date, default=datetime.date.today)
    voucher_type = Column(String(50), default="Receipt") # Receipt, Payment, Journal, Contra
    account_name = Column(String(100), default="Cash Account")
    party_name = Column(String(150), default="")
    debit = Column(Float, default=0.0)
    credit = Column(Float, default=0.0)
    payment_mode = Column(String(50), default="Bank") # Cash, Bank, UPI, Cheque
    reference_no = Column(String(50), default="")
    narration = Column(String(250), default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ExpenseVoucher(Base):
    __tablename__ = "expense_vouchers"
    id = Column(Integer, primary_key=True, index=True)
    voucher_no = Column(String(50), unique=True, index=True)
    category = Column(String(100), default="Travel & Site Visit")
    amount = Column(Float, default=0.0)
    paid_to = Column(String(100), default="")
    expense_date = Column(Date, default=datetime.date.today)
    payment_mode = Column(String(50), default="UPI")
    status = Column(String(50), default="Approved") # Submitted, Approved, Paid
    description = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- PRODUCTION & PROJECTS ---
class BillOfMaterials(Base):
    __tablename__ = "bills_of_materials"
    id = Column(Integer, primary_key=True, index=True)
    bom_no = Column(String(50), unique=True, index=True)
    product_name = Column(String(150), nullable=False)
    bom_type = Column(String(50), default="EBOM") # EBOM (Engineering), DBOM/MBOM (Manufacturing)
    version = Column(String(20), default="v1.0")
    status = Column(String(50), default="Approved")
    components_json = Column(Text, default="[]") # List of [{item_code, name, qty, uom, cost}]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ProductionOrder(Base):
    __tablename__ = "production_orders"
    id = Column(Integer, primary_key=True, index=True)
    so_no = Column(String(50), default="SO-001")
    project_no = Column(String(50), default="PRJ-001")
    customer_name = Column(String(100), default="salesnayak")
    contact_person = Column(String(100), default="sumit")
    technician = Column(String(100), default="NA")
    order_date = Column(Date, default=datetime.date.today)
    close_date = Column(Date, nullable=True)
    fy_year = Column(String(20), default="2026-2027")
    order_value = Column(Float, default=4000.0)
    bom_cost = Column(Float, default=0.0)
    expense = Column(Float, default=0.0)
    direct_issue = Column(Float, default=0.0)
    actual_cost = Column(Float, default=0.0)
    balance = Column(Float, default=4000.0)
    status = Column(String(50), default="Open Project") # New Project, Open Project, Completed Project
    stage = Column(String(100), default="Logistic/Warehouse")
    # Department stage items
    logistic_status = Column(String(100), default="Bank Loan Process (Jansamarth Portal)")
    technician_status = Column(String(100), default="Installation")
    dcr_status = Column(String(100), default="DCR Generation & Form Generation")
    qc_status = Column(String(50), default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
