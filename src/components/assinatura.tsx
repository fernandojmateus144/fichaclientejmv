import { useEffect, useRef, useState } from "react";

export function Assinatura({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const desenhando = useRef(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const escala = window.devicePixelRatio || 1;
    const largura = c.clientWidth;
    const altura = c.clientHeight;
    c.width = largura * escala;
    c.height = altura * escala;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(escala, escala);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, largura, altura);
      img.src = value;
    }
    setPronto(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ponto(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function inicio(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    desenhando.current = true;
    ref.current?.setPointerCapture(e.pointerId);
    const p = ponto(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function mover(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!desenhando.current) return;
    e.preventDefault();
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const p = ponto(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function fim() {
    if (!desenhando.current) return;
    desenhando.current = false;
    const c = ref.current;
    if (c) onChange(c.toDataURL("image/png"));
  }

  function limpar() {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    onChange("");
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-3">
        <span className="text-xs font-medium text-inksoft">{label}</span>
        <button
          type="button"
          onClick={limpar}
          className="no-print ml-auto rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-inksoft hover:bg-rail"
        >
          Limpar
        </button>
      </div>
      <canvas
        ref={ref}
        onPointerDown={inicio}
        onPointerMove={mover}
        onPointerUp={fim}
        onPointerLeave={fim}
        className="h-36 w-full touch-none rounded-md border border-line bg-paper"
      />
      <p className="mt-1 font-mono text-[11px] text-inksoft">
        {pronto ? "Assine com o dedo ou caneta dentro do quadro." : ""}
      </p>
    </div>
  );
}
