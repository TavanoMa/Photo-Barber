"use client"

import { useState } from "react"
import HaircutSelector from "@/src/components/HaircutSelector"
import ResultsGrid from "@/src/components/ResultsGrid"
import UploadPhoto from "@/src/components/UploadPhoto"

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null)
  const [haircut, setHaircut] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

async function generateHaircut() {
  if (!file || !haircut) {
    alert("Envie uma foto e selecione o Buzz Cut");
    return;
  }

  try {
    setLoading(true);
    setResult(null);

    // 🔍 DEBUG 1: Validando o que está saindo do Front
    console.log("--- INICIANDO GERAÇÃO ---");
    console.log("Arquivo:", file.name, `(${file.type})`);
    console.log("Corte:", haircut);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("haircut", haircut);
    formData.append("famousSlug", "buzzcut");

    const res = await fetch("/api/generate-image", {
      method: "POST",
      body: formData,
    });

    // 🔍 DEBUG 2: Capturando a resposta bruta antes do JSON
    const responseText = await res.text();
    console.log("Resposta bruta do servidor:", responseText);

    // Tentamos transformar em JSON manualmente
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Falha ao transformar resposta em JSON. O servidor provavelmente enviou um erro em HTML.");
      alert("Erro crítico no servidor. Olhe o console do seu VS Code/Terminal.");
      return;
    }

    if (!res.ok) {
      console.error("Erro retornado pela API:", data.error);
      alert(data.error || "Erro ao gerar");
      return;
    }

    // 🔍 DEBUG 3: Validando o formato do resultado
    console.log("Sucesso! URL/Base64 recebido:", data.image?.substring(0, 50) + "...");
    setResult(data.image);

  } catch (err) {
    console.error("Erro na requisição (Network Error):", err);
    alert("Erro de conexão ou erro interno");
  } finally {
    setLoading(false);
    console.log("--- FIM DO PROCESSO ---");
  }
}

  return (
    <div className="w-full bg-[#07070c] text-white">

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <UploadPhoto onSelect={setFile} />
          <HaircutSelector
            onGenerate={generateHaircut}
            onSelectHaircut={setHaircut}
            loading={loading}
          />
        </div>
      </section>

      <ResultsGrid result={result} />
    </div>
  )
}