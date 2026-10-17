FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 OMP_NUM_THREADS=2 MALLOC_ARENA_MAX=2
WORKDIR /app
RUN pip install --no-cache-dir "torch>=2.6,<3" "torchvision>=0.21,<1" --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir "Pillow>=10.4,<13"
RUN useradd --create-home --uid 10001 repera
COPY index.html style.css app.js gemini.js parts-data.js repair-options.js troubleshooting-data.js landing.js globe-land.js globe-texture.js ./
COPY ml/serve.py ml/hosted.py ml/dataset.py ml/predict.py ml/gemini_service.py ml/gemini-evidence.json ml/web_config.json ./ml/
COPY ml/models/miele-expansion-v3/experimental-final.pt ./ml/models/miele-expansion-v3/experimental-final.pt
USER repera
EXPOSE 10000
CMD ["python", "ml/hosted.py"]
