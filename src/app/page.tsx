"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificationCard } from "@/components/certification/certification-card";

interface Certification {
  name: string;
  description: string;
  languages: string[];
  price: string;
  url: string;
  level: string;
  provider: string;
}

interface ApiResponse {
  certifications: Certification[];
  source: "IA" | "cache";
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const certifications = data?.certifications ?? [];
  const source = data?.source;

  const availableLevels = useMemo(
    () => Array.from(new Set(certifications.map((c) => c.level))),
    [certifications]
  );
  const availableLanguages = useMemo(
    () =>
      Array.from(
        new Set(certifications.flatMap((c) => c.languages))
      ).sort(),
    [certifications]
  );

  const filtered = useMemo(() => {
    return certifications.filter((c) => {
      return (
        (selectedLevel === "all" || c.level === selectedLevel) &&
        (selectedLanguage === "all" ||
          c.languages.includes(selectedLanguage))
      );
    });
  }, [certifications, selectedLevel, selectedLanguage]);

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) return;

    setIsLoading(true);
    setError(null);
    setData(null);
    setSelectedLevel("all");
    setSelectedLanguage("all");

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("Falha ao buscar os dados.");
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Busca de Certificações
      </h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4 max-w-2xl mx-auto">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite a tecnologia (ex: Azure, AWS)..."
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-900 transition-colors"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {certifications.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-2xl mx-auto">
          <Select
            value={selectedLevel}
            onValueChange={setSelectedLevel}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Níveis</SelectItem>
              {availableLevels.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Idiomas</SelectItem>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {source && (
        <p className="text-center text-sm text-gray-500 mb-4">
          Dados de:{" "}
          <span className={`font-bold ${source === "cache" ? "text-green-600" : "text-blue-600"}`}>
            {source.toUpperCase()}
          </span>
        </p>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cert) => (
          <CertificationCard key={cert.name} certification={cert} />
        ))}
      </div>
    </div>
  );
}
