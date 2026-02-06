FROM python:3.10-slim

# ===============================
# 1. INSTALL SYSTEM DEPENDENCIES
# ===============================
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libgomp1 && \
    rm -rf /var/lib/apt/lists/*

# ===============================
# 2. SET WORKING DIRECTORY
# ===============================
WORKDIR /app

# ===============================
# 3. COPY REQUIREMENTS
# ===============================
COPY requirements.txt /app/requirements.txt

# ===============================
# 4. INSTALL PYTHON DEPENDENCIES
# ===============================
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ===============================
# 5. COPY APPLICATION FILES
# ===============================
COPY . /app

# ===============================
# 6. EXPOSE PORT
# ===============================
EXPOSE 8000

# ===============================
# 7. START FASTAPI
# ===============================
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
