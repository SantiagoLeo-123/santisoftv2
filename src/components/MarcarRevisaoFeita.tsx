import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { concluirCicloRevisao, type RevisaoPendente } from '@/services/mentorService';

interface MarcarRevisaoFeitaProps {
  revisao: RevisaoPendente;
}

/**
 * Revisão do Mentor sem simulado: o usuário revisa o tema por conta própria,
 * informa (se quiser) o percentual de acerto e marca a revisão como feita.
 * O percentual ajusta o próximo intervalo; em branco, o tema apenas avança.
 */
export function MarcarRevisaoFeita({ revisao }: MarcarRevisaoFeitaProps) {
  const [percentual, setPercentual] = useState('');

  const handleMarcar = () => {
    const valor = percentual.trim() === '' ? null : Number(percentual);
    const valido = valor !== null && Number.isFinite(valor);
    const pct = valido ? Math.min(100, Math.max(0, Math.round(valor as number))) : null;
    concluirCicloRevisao(
      revisao.temaId,
      revisao.ciclo,
      pct === null ? undefined : { acertos: pct, total: 100 },
    );
    setPercentual('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
      <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink-950/70 border border-ink-875 text-xs text-zinc-400">
        <span className="whitespace-nowrap">% de acerto</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={percentual}
          onChange={(e) => setPercentual(e.target.value)}
          placeholder="opcional"
          aria-label={`Percentual de acerto na revisão de ${revisao.tema}`}
          className="w-20 bg-transparent text-white text-sm font-bold tabular-nums outline-none placeholder:text-zinc-600 placeholder:font-normal"
        />
      </label>
      <button
        type="button"
        onClick={handleMarcar}
        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-red-600/20 active:scale-95 transition-all"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Marcar como feita</span>
      </button>
    </div>
  );
}
