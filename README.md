
# 💰 Supplier-Compliance-Dashboard

Developed InsightSphere, a compliance monitoring dashboard to track and enhance supplier adherence to contract terms, focusing on areas like delivery timelines, quality standards, and discount agreements.


## 🌟 Key Features

- Provided endpoints to add and retrieve supplier data, compliance records, and last audit details.
- Used OpenAI's compliance analysis to identify patterns in non-compliance data (e.g., late deliveries, quality issues), facilitating rapid issue categorization and reporting.
- Leveraged AI to generate actionable recommendations for procurement teams to improve supplier compliance, suggesting contract term adjustments, penalties, or alternative supplier options.
- Supported batch upload of compliance records, allowing teams to update the system with minimal manual entry.


## 🛠️ Technology Stack

- Backend: Built with FastAPI (Python)
- Frontend: React.js (with Vite as the build tool)
- Database: PostgreSQL
- ORM: Prisma
- AI: Gemini
## Run Locally

Install Ruby on your local system.

Clone the project

```bash
  git clone https://github.com/Vedarth1/Supplier-Compliance-Dashboard
```

Go to the project directory

```bash
  cd Supplier-Compliance-Dashboard
```

### Run Backend

Create Virtual Environment

```bash
  python -m venv myenv
```

Activate Environment

```bash
  source myenv/bin/activate
```

Install Dependencies

```bash
  pip install -r requirements.txt
```

start your backend service

```bash
  cd src
  python main.py
```

### Run Frontend

Go to the app directory

```bash
  cd app
```
Install dependencies

```bash
  npm install
```

start your frontend service

```bash
  npm run dev
```
