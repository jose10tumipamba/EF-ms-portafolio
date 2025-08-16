Primero, cree un entorno virtual llamado .venv

py -m venv .venv

Para activar el entorno virtual

En Linux/macOS
source .venv/bin/activate

En Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

Instala las dependencias nesesarias
pip install -r requirements.txt

Para ejecutar el proyecto, se usa uvicorn con recarga automática y especificando el puerto 

uvicorn app.main:app --reload --port 8000

Puede revisar la documentacion de las API:
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/redoc


Finalmente, para crear el front-end con React utilizamos

npm create vite@latest mi-proyecto-react --template react