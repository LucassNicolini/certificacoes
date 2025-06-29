"use client";

import { useState, useEffect } from "react";
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
  const [results, setResults] = useState<Certification[]>([]);
  const [filteredResults, setFilteredResults] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchSource, setSearchSource] = useState<string | null>(null);

  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  useEffect(() => {
    const applyFilters = () => {
      let updatedResults = [...results];

      if (selectedLevel !== "all") {
        updatedResults = updatedResults.filter(
          (cert) => cert.level === selectedLevel
        );
      }

      if (selectedLanguage !== "all") {
        updatedResults = updatedResults.filter((cert) =>
          cert.languages.includes(selectedLanguage)
        );
      }
      setFilteredResults(updatedResults);
    };

    applyFilters();
  }, [results, selectedLevel, selectedLanguage]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setFilteredResults([]);
    setSearchSource(null);
    setSelectedLevel("all");
    setSelectedLanguage("all");
    setAvailableLevels([]);
    setAvailableLanguages([]);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Falha ao buscar os dados. Tente novamente.");
      }

      const data: ApiResponse = await response.json();
      setResults(data.certifications);
      setSearchSource(data.source);

      if (data.certifications.length > 0) {
        const levels = [
          ...new Set(data.certifications.map((cert) => cert.level)),
        ];
        const languages = [
          ...new Set(data.certifications.flatMap((cert) => cert.languages)),
        ];
        setAvailableLevels(levels);
        setAvailableLanguages(languages.sort());
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Busca de Certificações
      </h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 max-w-2xl mx-auto">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite a tecnologia (ex: Azure, AWS)..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-500 cursor-pointer hover:bg-blue-900 transition-colors duration-200"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {results.length > 0 && (
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
              {availableLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
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

      <div className="text-center h-6 mb-4">
        {searchSource && (
          <p className="text-sm text-gray-500">
            Dados retornados do:{" "}
            <span
              className={`font-bold ${
                searchSource === "cache" ? "text-green-600" : "text-blue-600"
              }`}
            >
              {searchSource.toUpperCase()}
            </span>
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((cert) => (
          <CertificationCard key={cert.name} certification={cert} />
        ))}
      </div>
    </div>
  );
}
