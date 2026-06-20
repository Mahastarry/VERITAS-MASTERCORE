# VERITAS-MASTERCORE
CASE MANAGEMENT SYSTEM
# VERITAS MASTERCORE
### Enterprise Case Management Platform // Swiss Minimalist Edition

VERITAS MASTERCORE is a high-performance, ultra-clean case management platform built for legal professionals, independent counsels, and corporate legal departments. Designed with a strict focus on Swiss Minimalism and editorial layout aesthetics, the platform provides an un-cluttered, high-contrast workspace capable of scaling to over 1,000,000 users.

The system utilizes a modern **Three-Tier Architecture**: a blazing-fast, static HTML5/Tailwind frontend paired with a high-concurrency, asynchronous Python FastAPI backend engine backed by a PostgreSQL database layer.

---

## 🎨 Design Philosophy
- **Immaculate Contrast:** True Light Mode design prioritizing an off-white canvas (`#F8F9FA`) and pure white surfaces (`#FFFFFF`).
- **Deep Whitespace:** Generous structural breathing room allowing dense legal parameters to scan effortlessly at a single glance.
- **Micro-Borders:** Subtle, hairline containment lines (`rgba(0,0,0,0.06)`) replacing heavy corporate table grids.

---

## 🚀 Key Functional Capabilities

### 1. Unified System Authorization
A secure, low-profile gateway portal protecting institutional data. Sessions are authorized via secure JSON Web Tokens (JWT), ensuring complete tenant isolation.

### 2. 12-Parameter Data Registry
A beautifully balanced configuration form structured to ingest and map exactly 12 master legal data matrices:
- Core Identifiers: Case Index No, Judicial Forum, Writ/Case Type, Filing Year Target.
- Parties & Counsel: Petitioner Party Name, Respondent Party Name, Advocate on Record.
- Metadata & Lifecycles: Classification Category, Current Case Status, Keywords Mapping.
- Chronological Ranges: Allocation Filing Date Window, Intelligent Scheduled Hearing Range.

### 3. Granular Multi-Tier Download Engine
- **Separate Individual Isolation:** Instant standalone export triggers located directly on every ledger item row.
- **Multi-Select Batch Compilation:** Checkbox matrix tracking allowing users to compile multi-selected files on demand.
- **Active Filter Aggregation:** Universal real-time search screening matched with a macro to download exactly what remains visible on screen.
- **Advanced Parametric Matrix Panel:** Slide-out utility tray to download massive data blocks isolated by specific Filing Year, Categories, Forums, or Assignment States.

---

## 🛠️ System Architecture & Tech Stack

- **Frontend Interface:** HTML5, Tailwind CSS v4 (Engine Compiler), Alpine.js (Reactive Client State Machine).
- **Typography Engine:** *Plus Jakarta Sans* (Body/Editorial Data Scale) & *Space Grotesk* (Technical Data Tracking elements).
- **Backend Infrastructure:** Python 3.10+, FastAPI (Asynchronous ASGI Web Framework), SQLAlchemy (Object-Relational Mapping).
- **Database Engine:** PostgreSQL (High-performance indexed relational data store).

---

## 💻 Local Installation & Setup

### Prerequisites
Ensure you have Python 3.10+ and `pip` installed on your system.

### 1. Backend Configuration
Navigate to your backend service directory and execute the following commands:

```bash
# Clone the repository structure
git clone [https://github.com/your-username/veritas-mastercore.git](https://github.com/your-username/veritas-mastercore.git)
cd veritas-mastercore/backend

# Create a clean virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install high-scale production dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary pyjwt passlib[bcrypt]
