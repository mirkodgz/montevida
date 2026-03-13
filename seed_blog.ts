import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Configure dotenv to read from .env.local
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

const generatePortableText = (paragraphs: string[]) => {
    return paragraphs.map((text, i) => ({
        _type: 'block',
        _key: `block-${Date.now()}-${i}`,
        style: 'normal',
        markDefs: [],
        children: [
            {
                _type: 'span',
                _key: `span-${Date.now()}-${i}`,
                text: text,
                marks: [],
            },
        ],
    }));
};

const posts = [
    {
        _type: 'post',
        title: 'El poder de las gomitas para tu día a día: Energía, Belleza y Salud',
        slug: { _type: 'slug', current: 'el-poder-de-las-gomitas' },
        publishedAt: new Date().toISOString(),
        excerpt: 'Descubre por qué las gomitas se han convertido en el aliado número uno para quienes buscan una forma práctica de cuidar su salud.',
        body: generatePortableText([
            'En el mundo acelerado de hoy, mantener una dieta equilibrada y asegurar la ingesta adecuada de vitaminas y minerales puede ser un verdadero desafío. Las rutinas diarias nos dejan con poco tiempo, y es ahí donde las gomitas vitamínicas entran como los superhéroes de nuestra nutrición.',
            'A diferencia de las píldoras tradicionales, grandes y difíciles de tragar, las gomitas ofrecen una experiencia deliciosa y práctica. Ya no necesitas un vaso de agua ni recordar tomar la pastilla después de una gran comida; las gomitas se pueden disfrutar en cualquier momento del día como un dulce nutritivo.',
            '¿Sabías que ciertas gomitas están formuladas específicamente para mejorar aspectos puntuales de tu vida? Desde la biotina para un cabello y uñas de impacto, hasta la Ashwagandha para combatir el estrés. Al ser masticables, permiten una rápida absorción en nuestro cuerpo, ayudándote a sentir sus beneficios de manera más eficiente.',
            'La próxima vez que pienses en cómo complementar tu dieta, recuerda que no tiene que ser una tarea aburrida. Las gomitas están aquí para demostrar que la salud y el buen sabor pueden ir de la mano.'
        ]),
    },
    {
        _type: 'post',
        title: '¿Por qué las vitaminas en gomitas son la nueva tendencia de bienestar?',
        slug: { _type: 'slug', current: 'vitaminas-en-gomitas-tendencia' },
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        excerpt: 'Analizamos las razones detrás de la fuerte popularidad mundial de las gomitas funcionales. No es solo sabor, es ciencia.',
        body: generatePortableText([
            'La industria del bienestar evoluciona constantemente. Si hace unas décadas las cápsulas duras dominaban la escena, hoy es innegable el dominio de los suplementos masticables, especialmente las gomitas funcionales.',
            'Según estudios del mercado nutracéutico global, una barrera muy común para la adherencia a los tratamientos vitamínicos era la "fatiga de las píldoras". Muchas personas abandonaban su suplementación al detestar la textura o sabor medicinal de vitaminas convencionales.',
            'Las gomitas rompen esta barrera. La inclusión de pectina y bases frutales las convierte en golosinas con propósito. Ahora el consumidor no "tiene qué" tomar vitaminas, sino que "quiere" hacerlo. Es un refuerzo conductual positivo impulsado por el delicioso sabor de los nutrientes revestidos.',
            'Desde el colágeno hasta fórmulas para dormir a base de melatonina, todo está siendo re-imaginado a través del formato en gomita, probando que cuidar nuestro cuerpo puede ser un momento de pura satisfacción. Explora la increíble línea SOTTCOR y nota tú mismo la diferencia.'
        ]),
    },
    {
        _type: 'post',
        title: 'Mitos y realidades: ¿Son realmente efectivas las gomitas nutricionales?',
        slug: { _type: 'slug', current: 'mitos-y-realidades-gomitas-nutricionales' },
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        excerpt: 'Despejamos las dudas más comunes acerca de si los nutrientes sobreviven en estas deliciosas presentaciones de pectina.',
        body: generatePortableText([
            'Con la inmensa popularidad de las gomitas para la salud, también han surgido preguntas muy válidas sobre su verdadera eficacia. Vamos a despejar estas dudas comunes que nos hacen nuestros clientes en Montevida.',
            'Mito 1: Son puro azúcar. Realidad: Las nuevas formulaciones utilizan edulcorantes sin calorías, extractos de frutas, y controlan rigurosamente el índice glucémico para asegurarse de que el beneficio nutricional supere ampliamente a cualquier adición dulce mínima necesaria para el sabor.',
            'Mito 2: Pierden propiedades. Realidad: Las tecnologías modernas en la ingeniería de alimentos utilizan el recubrimiento y matrices a baja temperatura, las cuales conservan e intactan moléculas sensibles como la vitamina C o los aceites esenciales Omega. Se ha demostrado clínícamente que son absorbidas eficientemente por nuestro tracto digestivo.',
            'Mito 3: Son sólo para niños. Realidad: ¡En absoluto! Las dosis están calculadas meticulosamente para cubrir las necesidades biológicas de los adultos. Las versiones de Maca Negra o los complejos avanzados B resultan excelentes aliados del deportista o ejecutivo del día moderno.',
            'En conclusión, lejos de ser simples golosinas, las gomitas modernas son laboratorios nutricionales concentrados diseñados para potenciar cada área de nuestra salud sin sacrificar el paladar.'
        ]),
    }
];

async function seed() {
    console.log('Seeding blog posts...');
    for (const post of posts) {
        console.log(`Inserting: ${post.title}`);
        await client.create(post);
    }
    console.log('✅ Blog seeded successfully!');
}

seed().catch(err => {
    console.error('Error seeding blog:', err);
});
