# ============================================
#  CARRUSEL DE CERTIFICADOS - AUTOACTUALIZABLE
#  (Evita duplicados y opción de actualización manual)
# ============================================

import re
import json
import sys
from pathlib import Path
from datetime import datetime, timedelta
import hashlib
import json


# ===============================
# DATOS DE LOS CERTIFICADOS
# ===============================
CERTIFICADOS_DATA = [
    {
        "titulo": "Artificial Intelligence (AI)",
        "plataforma": "Curso de IBM SkillsBuild via NetAcad",
        "logo_src": "./assets/sources/certificates/IBM.png",
        "alt_text": "Logo de Cisco e IBM SkillsBuild",
        "estado": "Completado",
        "tags": ["Inteligencia Artificial", "IBM", "NetAcad"],
        "link_href": "https://www.netacad.com/courses/ai-ibm-skillsbuild?courseLang=es-XL",
        "link_text": "Ver Curso"
    },
    {
        "titulo": "Azure Administrator Associate (AZ-104)",
        "plataforma": "Certificación de Nivel Asociado",
        "logo_src": "./assets/sources/logos/microsoft_logo.png",
        "alt_text": "Logo de Microsoft Learn",
        "estado": "En Progreso",
        "tags": ["Microsoft Azure", "Cloud", "Certificación"],
        "link_href": "#",
        "link_text": "Detalles del Estudio"
    },
    {
        "titulo": "CCNA: Introducción a Redes",
        "plataforma": "Módulo 1 de Certificación Cisco",
        "logo_src": "./assets/sources/logos/cisco_logo.png",
        "alt_text": "Logo de Cisco Networking Academy",
        "estado": "Completado",
        "tags": ["Cisco", "Redes", "Networking"],
        "link_href": "https://www.credly.com/",
        "link_text": "Ver Credencial"
    }
]


# ===============================
# FUNCIONES BASE
# ===============================
def generar_tarjeta_html(certificado):
    """Genera el HTML de una tarjeta individual."""
    estado_clase = {
        "Completado": "tag-completed",
        "En Progreso": "tag-progress",
        "Por Hacer": "tag-todo"
    }.get(certificado["estado"], "")

    tags_html = "".join(f'<span class="project-tag">{tag}</span>' for tag in certificado["tags"])

    return f"""
        <div class="project-card certificate-card">
            <div class="project-image-container certificate-logo-container">
                <img src="{certificado['logo_src']}" alt="{certificado['alt_text']}" loading="lazy">
            </div>
            <div class="project-content">
                <h3>{certificado['titulo']}</h3>
                <p>{certificado['plataforma']}</p>
                <div class="project-tags">
                    <span class="project-tag {estado_clase}">{certificado['estado']}</span>
                    {tags_html}
                </div>
                <div class="project-links">
                    <a href="{certificado['link_href']}" class="project-link" aria-label="Enlace a {certificado['titulo']}">
                        {certificado['link_text']}
                    </a>
                </div>
            </div>
        </div>
    """


def generar_carrusel_completo(datos):
    """Genera el HTML completo del carrusel (duplicado para efecto infinito)."""
    carrusel_content = "".join(generar_tarjeta_html(cert) for cert in datos)
    carrusel_content += carrusel_content  # duplicado visual
    return carrusel_content


# ===============================
# FUNCIONES DE ACTUALIZACIÓN
# ===============================

def hash_datos(data):
    """Genera un hash único del contenido actual de CERTIFICADOS_DATA."""
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode("utf-8")).hexdigest()


def necesita_actualizacion(archivo_registro, force=False):
    """
    Determina si deben aplicarse los cambios:
    - Si --force está activo → siempre actualiza.
    - Si los datos cambiaron → actualiza.
    - Si pasaron más de 30 días → actualiza.
    """
    if force:
        print("⚙️  Actualización forzada manualmente (--force)")
        return True

    data_hash = hash_datos(CERTIFICADOS_DATA)

    if not archivo_registro.exists():
        print("🆕 No hay registro previo — se generará por primera vez.")
        return True

    try:
        data = json.loads(archivo_registro.read_text(encoding="utf-8"))
        ultima_fecha = datetime.fromisoformat(data.get("ultima_ejecucion"))
        hash_guardado = data.get("hash_datos")

        # Condición: si pasaron 30 días o cambió el hash → actualizar
        if datetime.now() - ultima_fecha > timedelta(days=30):
            print("📅 Han pasado más de 30 días, se actualizará el carrusel.")
            return True
        if hash_guardado != data_hash:
            print("🧩 Los datos de CERTIFICADOS_DATA cambiaron, se actualizará el carrusel.")
            return True

        print("⏳ No es necesario actualizar (sin cambios recientes).")
        return False

    except Exception as e:
        print(f"⚠️ Error leyendo registro de actualización: {e}")
        return True


def registrar_ejecucion(archivo_registro):
    """Guarda la fecha y hash actual de los datos."""
    data = {
        "ultima_ejecucion": datetime.now().isoformat(),
        "hash_datos": hash_datos(CERTIFICADOS_DATA)
    }
    archivo_registro.write_text(json.dumps(data, indent=4), encoding="utf-8")

# ===============================
# CONTROL DE ACTUALIZACIÓN MENSUAL
# ===============================
def necesita_actualizacion(archivo_registro, force=False):
    """Determina si deben aplicarse los cambios."""
    if force:
        print("⚙️  Actualización forzada manualmente (--force)")
        return True

    if not archivo_registro.exists():
        return True

    try:
        data = json.loads(archivo_registro.read_text(encoding="utf-8"))
        ultima_fecha = datetime.fromisoformat(data.get("ultima_ejecucion"))
        return datetime.now() - ultima_fecha > timedelta(days=30)
    except Exception:
        return True


def registrar_ejecucion(archivo_registro):
    """Guarda la fecha de la última actualización."""
    data = {"ultima_ejecucion": datetime.now().isoformat()}
    archivo_registro.write_text(json.dumps(data, indent=4), encoding="utf-8")


def insertar_en_index(html_generado, ruta_index):
    """
    Reemplaza el bloque del carrusel en index.html de forma robusta.
    Analiza los <div> anidados y evita duplicaciones incluso si se ejecuta muchas veces.
    """
    contenido = Path(ruta_index).read_text(encoding="utf-8")

    inicio_marcador = '<div class="certificates-carousel-track'
    idx_inicio = contenido.find(inicio_marcador)

    if idx_inicio == -1:
        # Si no hay carrusel, lo añadimos al final del archivo
        print("⚠️ No se encontró bloque de carrusel, se insertará uno nuevo al final del archivo.")
        nuevo_bloque = f'\n<div class="certificates-carousel-track projects-grid">\n{html_generado}\n</div>\n'
        contenido += nuevo_bloque
    else:
        # --- Contar <div> y </div> para hallar el cierre real ---
        count_divs = 0
        pos = idx_inicio
        while pos < len(contenido):
            if contenido.startswith("<div", pos):
                count_divs += 1
            elif contenido.startswith("</div>", pos):
                count_divs -= 1
                if count_divs == 0:
                    # Encontramos el cierre del bloque principal
                    idx_fin = pos + len("</div>")
                    break
            pos += 1
        else:
            print("❌ No se encontró el cierre del bloque de carrusel.")
            return

        # --- Reemplazar el contenido completo ---
        antes = contenido[:idx_inicio]
        despues = contenido[idx_fin:]
        nuevo_bloque = f'<div class="certificates-carousel-track projects-grid">\n{html_generado}\n</div>'
        contenido = antes + nuevo_bloque + despues
        print("♻️ Carrusel reemplazado correctamente sin duplicar.")

    Path(ruta_index).write_text(contenido, encoding="utf-8")
    print("✅ index.html actualizado sin duplicaciones.")


# ===============================
# BLOQUE PRINCIPAL
# ===============================
if __name__ == "__main__":
    # Soporte para argumento --force
    force_update = "--force" in sys.argv

    ruta_index = Path(__file__).resolve().parents[2] / "index.html"
    registro = Path(__file__).resolve().parent / "actualizacion.json"

    if not ruta_index.exists():
        print("❌ No se encontró index.html en la ruta esperada.")
    elif not necesita_actualizacion(registro, force_update):
        print("⏳ No es necesario actualizar (sin cambios recientes).")
    else:
        carrusel_html = generar_carrusel_completo(CERTIFICADOS_DATA)
        insertar_en_index(carrusel_html, ruta_index)
        registrar_ejecucion(registro)
        print("✨ Proceso completado y fecha registrada.")

# ===============================
# COMANDOS
# ===============================
#python certificados.py --force