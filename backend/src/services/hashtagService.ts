// src/services/hashtagService.ts
import { HashtagStats, IHashtagStats } from '../models/Hashtag';
import { Feedback } from '../models/Feedback';

export class HashtagService {

    // Obter hashtags populares
    async obterHashtagsPopulares(limite: number = 20): Promise<IHashtagStats[]> {
        return await HashtagStats.find({ ativa: true })
            .sort({ total_usos: -1 })
            .limit(limite)
            .exec();
    }

    // Obter hashtags trending (última semana)
    async obterHashtagsTrending(limite: number = 10): Promise<IHashtagStats[]> {
        return await HashtagStats.find({
            ativa: true,
            usos_ultima_semana: { $gte: 3 }
        })
            .sort({ usos_ultima_semana: -1, ultimo_uso: -1 })
            .limit(limite)
            .exec();
    }

    // Buscar hashtags por texto
    async buscarHashtags(texto: string, limite: number = 10): Promise<IHashtagStats[]> {
        return await HashtagStats.find({
            tag: { $regex: texto, $options: 'i' },
            ativa: true
        })
            .sort({ total_usos: -1 })
            .limit(limite)
            .exec();
    }

    // Obter detalhes de uma hashtag específica
    async obterDetalheHashtag(tag: string): Promise<{
        hashtag: IHashtagStats | null;
        feedbacks_recentes: any[];
        total_feedbacks: number;
    }> {
        const hashtag = await HashtagStats.findOne({ tag: tag.toLowerCase() });

        if (!hashtag) {
            return {
                hashtag: null,
                feedbacks_recentes: [],
                total_feedbacks: 0
            };
        }

        const [feedbacks_recentes, total_feedbacks] = await Promise.all([
            Feedback.find({ hashtags: tag.toLowerCase() })
                .populate('usuario_id', 'nome email')
                .populate('forum_id', 'nome projeto')
                .sort({ data_criacao: -1 })
                .limit(5)
                .exec(),
            Feedback.countDocuments({ hashtags: tag.toLowerCase() })
        ]);

        return {
            hashtag,
            feedbacks_recentes,
            total_feedbacks
        };
    }

    // Obter estatísticas gerais de hashtags
    async obterEstatisticasGerais(): Promise<{
        total_hashtags: number;
        hashtags_ativas: number;
        hashtags_trending: number;
        hashtags_populares: number;
        crescimento_semana: number;
        top_10_populares: any[];
        top_10_trending: any[];
    }> {
        const [
            total_hashtags,
            hashtags_ativas,
            hashtags_trending,
            hashtags_populares,
            top_populares,
            top_trending
        ] = await Promise.all([
            HashtagStats.countDocuments(),
            HashtagStats.countDocuments({ ativa: true }),
            HashtagStats.countDocuments({ usos_ultima_semana: { $gte: 3 } }),
            HashtagStats.countDocuments({ total_usos: { $gte: 10 } }),
            this.obterHashtagsPopulares(10),
            this.obterHashtagsTrending(10)
        ]);

        // Calcular crescimento da semana (simplificado)
        const crescimento_semana = hashtags_trending;

        return {
            total_hashtags,
            hashtags_ativas,
            hashtags_trending,
            hashtags_populares,
            crescimento_semana,
            top_10_populares: top_populares,
            top_10_trending: top_trending
        };
    }

    // Obter sugestões de hashtags baseadas em texto
    async obterSugestoes(texto: string, limite: number = 5): Promise<string[]> {
        const palavras = texto.toLowerCase()
            .split(/\s+/)
            .filter(palavra => palavra.length >= 3)
            .map(palavra => palavra.replace(/[^a-zA-Z0-9]/g, ''));

        const sugestoes: string[] = [];

        for (const palavra of palavras) {
            const hashtags = await HashtagStats.find({
                tag: { $regex: palavra, $options: 'i' },
                ativa: true
            })
                .sort({ total_usos: -1 })
                .limit(2)
                .exec();

            hashtags.forEach(h => {
                if (!sugestoes.includes(h.tag) && sugestoes.length < limite) {
                    sugestoes.push(h.tag);
                }
            });
        }

        return sugestoes;
    }

    // Resetar contadores semanais (para executar via cron job)
    async resetarContadoresSemana(): Promise<void> {
        await HashtagStats.updateMany({}, { usos_ultima_semana: 0 });
    }

    // Resetar contadores mensais (para executar via cron job)
    async resetarContadoresMes(): Promise<void> {
        await HashtagStats.updateMany({}, { usos_ultimo_mes: 0 });
    }

    // Desativar hashtags não utilizadas há muito tempo
    async desativarHashtagsInativas(diasInatividade: number = 90): Promise<number> {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - diasInatividade);

        const resultado = await HashtagStats.updateMany(
            {
                ultimo_uso: { $lt: dataLimite },
                ativa: true
            },
            { ativa: false }
        );

        return resultado.modifiedCount;
    }

    // Obter análise de hashtags por período
    async obterAnalisePorPeriodo(diasAtras: number = 30): Promise<{
        periodo: string;
        total_usos: number;
        hashtags_novas: number;
        hashtags_mais_usadas: any[];
    }> {
        const dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - diasAtras);

        const [
            feedbacksComHashtags,
            hashtagsNovas
        ] = await Promise.all([
            Feedback.find({
                data_criacao: { $gte: dataInicio },
                hashtags: { $exists: true, $ne: [] }
            }).exec(),
            HashtagStats.countDocuments({
                primeiro_uso: { $gte: dataInicio }
            })
        ]);

        // Contar uso de hashtags no período
        const contagemHashtags: { [key: string]: number } = {};
        feedbacksComHashtags.forEach(feedback => {
            feedback.hashtags.forEach(tag => {
                contagemHashtags[tag] = (contagemHashtags[tag] || 0) + 1;
            });
        });

        const hashtags_mais_usadas = Object.entries(contagemHashtags)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, usos: count }));

        const total_usos = Object.values(contagemHashtags)
            .reduce((total, count) => total + count, 0);

        return {
            periodo: `Últimos ${diasAtras} dias`,
            total_usos,
            hashtags_novas: hashtagsNovas,
            hashtags_mais_usadas
        };
    }
}