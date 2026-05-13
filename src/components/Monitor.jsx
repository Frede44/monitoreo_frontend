import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    if (valueAngle === null) {
        // No value to display
        return null;
    }

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="red" />
            <path
                d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                stroke="red"
                strokeWidth={3}
            />
        </g>
    );
}

export default function Monitor({ valor,  unidad, magnitud, maxValor }) {
    return (
        <div>
            <div>
            <GaugeContainer
                width={200}
                height={200}
                startAngle={-maxValor}
                endAngle={maxValor}
                value={valor}
            >
                <GaugeReferenceArc />
                <GaugeValueArc />
                <GaugePointer />
            </GaugeContainer>
        </div>
        <div>
            <p className="text-xl font-bold">{magnitud}</p>
            <p className="text-2xl font-bold">{valor} {unidad}</p>
        </div>
        </div>
    )
}