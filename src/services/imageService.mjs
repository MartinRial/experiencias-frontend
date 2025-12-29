import { API_URL } from "../config/api";

const URL_IMAGES = `${API_URL}/images`;

// Subir imagen (Base64)
export async function uploadImage(base64) {
    const res = await fetch(URL_IMAGES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
    });
    if (!res.ok) throw new Error("Error al subir la imagen");
    return await res.json();
}

// Eliminar imagen por public_id
export async function deleteImage(publicId) {
    const res = await fetch(`${URL_IMAGES}/${encodeURIComponent(publicId)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar la imagen");
    return await res.json();
}
