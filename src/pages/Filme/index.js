import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./filme-info.css";
import { toast } from "react-toastify";

import api from "../service/api";

function Filme() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilme() {
      await api
        .get(`/movie/${id}`, {
          params: {
            api_key: "28fc232cc001c31e8a031f419d0a14ca",
            language: "pt-BR",
          },
        })
        .then((response) => {
          setFilme(response.data);
          setLoading(false);
        })
        .catch(() => {
          navigate("/", { replace: true });
        });
    }

    loadFilme();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="filme-info">
        <h1>Carregando detalhes...</h1>
      </div>
    );
  }

  function salvarFilme() {
    const minhaLista = localStorage.getItem("@primeFlix");

    let filmeSalvos = JSON.parse(minhaLista) || [];

    const hasFilme = filmeSalvos.some(
      (filmeSalvos) => filmeSalvos.id === filme.id
    );

    if (hasFilme) {
      toast.warning("Esse filme já foi salvo, verifique na tela meus filmes");
      return;
    }

    filmeSalvos.push(filme);
    localStorage.setItem("@primeFlix", JSON.stringify(filmeSalvos));
    toast.success("Filme salvo com sucesso");
  }

  return (
    <div className="filme-info">
      <h1>{filme.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
        alt={filme.title}
      />

      <h3>Sinopse</h3>
      <span>{filme.overview}</span>

      <strong>Avalição: {filme.vote_average} / 10</strong>

      <div className="area-button">
        <button onClick={salvarFilme}>Salvar</button>
        <button>
          <a
            target="blank"
            rel="external"
            href={`https://youtube.com/results?search_query=${filme.title} Trailer`}
          >
            Trailer
          </a>
        </button>
      </div>
    </div>
  );
}

export default Filme;
