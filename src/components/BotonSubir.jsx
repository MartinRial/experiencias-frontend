import React, { useId, useState } from "react";

export default function BotonSubir({ onFileSelect }) {
  const [fileName, setFileName] = useState("");

  const tamanioMegas = 10;

  const botonId = useId();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    //  Limite de tamaño: tamanio megas
    const maxSize = tamanioMegas * 1024 * 1024; // tamanio megas
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. Máximo ${tamanioMegas}MB.`);
      return;
    }

    //  Limitar extensiones
    // const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    // if (!allowedTypes.includes(file.type)) {
    //   alert("Formato de archivo no permitido. Solo JPG, PNG o GIF.");
    //   return;
    // }

    //  Si pasa las validaciones, actualizar estado y pasar al padre
    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        type="file"
        id={botonId}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label
        htmlFor={botonId}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          textAlign: "center",
          width: "fit-content",
        }}
      >
        📤 Subir archivo
      </label>

      {fileName && (
        <span style={{ fontSize: "0.9rem", color: "#444" }}>
          Archivo seleccionado: <b>{fileName}</b>
        </span>
      )}
    </div>
  );
}
