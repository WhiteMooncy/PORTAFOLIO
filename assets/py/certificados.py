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
        "titulo": "GitHub Actions",
        "plataforma": "Certificación de Microsoft Learn",
        # RUTA DE IMAGEN: Insignia de GitHub Actions
        "logo_src": "./assets/sources/logos/github_badges/github-actions.svg", 
        "alt_text": "Insignia de Certificación GitHub Actions de Microsoft Learn",
        "estado": "En Progreso", 
        "tags": ["GitHub", "DevOps", "CI/CD"],
        "link_href": "https://learn.microsoft.com/es-es/credentials/certifications/github-actions/?practice-assessment-type=certification",
        "link_text": "Ver Examen"
    },
    {
        "titulo": "GitHub Administration",
        "plataforma": "Certificación de Microsoft Learn",
        # RUTA DE IMAGEN: Insignia de GitHub Administration
        "logo_src": "./assets/sources/logos/github_badges/github-administration.svg", 
        "alt_text": "Insignia de Certificación GitHub Administration de Microsoft Learn",
        "estado": "En Progreso", 
        "tags": ["GitHub", "Administración", "Git"],
        "link_href": "https://learn.microsoft.com/es-es/credentials/certifications/github-administration/?practice-assessment-type=certification",
        "link_text": "Ver Examen"
    },
    {
        "titulo": "GitHub Advanced Security",
        "plataforma": "Certificación de Microsoft Learn",
        # RUTA DE IMAGEN: Insignia de GitHub Advanced Security
        "logo_src": "./assets/sources/logos/github_badges/github-advanced-security.svg", 
        "alt_text": "Insignia de Certificación GitHub Advanced Security de Microsoft Learn",
        "estado": "En Progreso", 
        "tags": ["GitHub", "Seguridad", "DevSecOps"],
        "link_href": "https://learn.microsoft.com/es-es/credentials/certifications/github-advanced-security/?practice-assessment-type=certification",
        "link_text": "Ver Examen"
    },
    {
        "titulo": "GitHub Copilot",
        "plataforma": "Habilidad Aplicada de Azure",
        # RUTA DE IMAGEN: Insignia de Habilidad Aplicada de GitHub Copilot
        "logo_src": "./assets/sources/logos/github_badges/github-copilot.svg", 
        "alt_text": "Insignia de Habilidad Aplicada GitHub Copilot de Microsoft Learn",
        "estado": "En Progreso", 
        "tags": ["GitHub", "Copilot", "IA"],
        "link_href": "https://learn.microsoft.com/es-es/credentials/applied-skills/accelerate-app-development-by-using-github-copilot",
        "link_text": "Ver Habilidad"
    },
    {
        "titulo": "Artificial Intelligence (AI)",
        "plataforma": "Curso de IBM SkillsBuild via NetAcad",
        "logo_src": "./assets/sources/logos/cisco/IBM.png", # Se mantiene la ruta original de IBM
        "alt_text": "Logo de Cisco e IBM SkillsBuild",
        "estado": "Completado", 
        "tags": ["Inteligencia Artificial", "IBM", "NetAcad"],
        "link_href": "https://www.netacad.com/courses/ai-ibm-skillsbuild?courseLang=es-XL",
        "link_text": "Ver Curso"
    }
]


# ===============================
# FUNCIONES BASE
# ===============================
def generar_tarjeta_html(certificado):
    """Genera el HTML de una tarjeta individual. Usa imagen por defecto si no se encuentra el logo."""
    base_path = Path(__file__).resolve().parents[2]
    default_path = base_path / "assets" / "sources" / "logos" / "default.png"

    # Crear una imagen por defecto si no existe
    if not default_path.exists():
        from PIL import Image, ImageDraw, ImageFont
        default_path.parent.mkdir(parents=True, exist_ok=True)
        img = Image.new("RGB", (400, 250), color=(200, 200, 200))
        d = ImageDraw.Draw(img)
        d.text((50, 100), "Sin imagen", fill=(0, 0, 0))
        img.save(default_path)
        print("🖼️ Se creó automáticamente 'default.png'.")

    logo_src = certificado.get("logo_src", "./assets/sources/logos/default.png").strip()
    if not logo_src:
        logo_src = "./assets/sources/logos/default.png"

    logo_path = base_path / Path(logo_src.replace("./", ""))

    if not logo_path.exists():
        print(f"⚠️ Imagen no encontrada: {logo_path.name} → usando imagen por defecto.")
        logo_src = "./assets/sources/logos/default.png"

    estado_clase = {
        "Completado": "tag-completed",
        "En Progreso": "tag-progress",
        "Por Hacer": "tag-todo"
    }.get(certificado.get("estado", ""), "")

    tags_html = "".join(f'<span class="project-tag">{tag}</span>' for tag in certificado.get("tags", []))

    return f"""
        <div class="project-card certificate-card">
            <div class="project-image-container certificate-logo-container">
                <img src="{logo_src}" alt="{certificado.get('alt_text', 'Logo de Certificado')}" loading="lazy">
            </div>
            <div class="project-content">
                <h3>{certificado.get('titulo', 'Certificado sin título')}</h3>
                <p>{certificado.get('plataforma', '')}</p>
                <div class="project-tags">
                    <span class="project-tag {estado_clase}">{certificado.get('estado', '')}</span>
                    {tags_html}
                </div>
                <div class="project-links">
                    <a href="{certificado.get('link_href', '#')}" class="project-link" aria-label="Enlace a certificado">
                        {certificado.get('link_text', 'Ver más')}
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