import React, { useState } from 'react';
import { Share2, X, Trophy, Star, Target, Zap, ExternalLink } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    date: string;
    progress?: number;
}

const ShareAchievements: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    // Conquistas de exemplo
    const achievements: Achievement[] = [
        {
            id: '1',
            title: 'Primeiro Commit',
            description: 'Realizou seu primeiro commit no projeto',
            icon: <Trophy className="w-6 h-6" />,
            color: 'from-yellow-400 to-orange-500',
            date: '2025-05-31',
            progress: 100
        },
        {
            id: '2',
            title: 'Streak de 7 dias',
            description: 'Programou por 7 dias consecutivos',
            icon: <Zap className="w-6 h-6" />,
            color: 'from-purple-500 to-pink-500',
            date: '2025-05-30',
            progress: 100
        },
        {
            id: '3',
            title: 'Code Master',
            description: 'Completou 50 desafios de programação',
            icon: <Star className="w-6 h-6" />,
            color: 'from-blue-500 to-cyan-500',
            date: '2025-05-29',
            progress: 85
        },
        {
            id: '4',
            title: 'Team Player',
            description: 'Colaborou em 10 projetos diferentes',
            icon: <Target className="w-6 h-6" />,
            color: 'from-green-500 to-teal-500',
            date: '2025-05-28',
            progress: 100
        }
    ];

    const handleShare = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
        setIsModalOpen(true);
    };

    const generateShareText = (achievement: Achievement) => {
        return `🎉 Acabei de conquistar: "${achievement.title}"! ${achievement.description} 💪 #Hackatona2025 #Equipe0x #Programming`;
    };

    const shareToLinkedIn = (achievement: Achievement) => {
        const text = encodeURIComponent(generateShareText(achievement));
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${text}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    const shareToTwitter = (achievement: Achievement) => {
        const text = encodeURIComponent(generateShareText(achievement));
        const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    const shareToWhatsApp = (achievement: Achievement) => {
        const text = encodeURIComponent(`${generateShareText(achievement)} ${window.location.href}`);
        const url = `https://wa.me/?text=${text}`;
        window.open(url, '_blank');
    };

    const shareToInstagram = (achievement: Achievement) => {
        // Instagram não permite compartilhamento direto via URL, então copiamos o texto
        const text = generateShareText(achievement);
        navigator.clipboard.writeText(text).then(() => {
            alert('Texto copiado! Cole no Instagram Stories ou Feed 📱');
        });
    };

    const copyToClipboard = (achievement: Achievement) => {
        const text = generateShareText(achievement);
        navigator.clipboard.writeText(text).then(() => {
            alert('Texto copiado para a área de transferência! 📋');
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Suas <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Conquistas</span>
                    </h1>
                    <p className="text-xl text-gray-300">
                        Compartilhe seus sucessos com o mundo! 🚀
                    </p>
                </div>

                {/* Conquistas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="group relative bg-gray-800 bg-opacity-50 border border-gray-700 border-opacity-50 rounded-2xl p-6 hover:border-purple-500 hover:border-opacity-50 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-xl flex items-center justify-center text-white`}>
                                    {achievement.icon}
                                </div>
                                <button
                                    onClick={() => handleShare(achievement)}
                                    className="opacity-0 group-hover:opacity-100 p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200"
                                >
                                    <Share2 className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                            <p className="text-gray-400 mb-4">{achievement.description}</p>

                            {achievement.progress && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                                        <span>Progresso</span>
                                        <span>{achievement.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 bg-gradient-to-r ${achievement.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${achievement.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{achievement.date}</span>
                                {achievement.progress === 100 && (
                                    <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs font-medium">
                    Completado
                  </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de Compartilhamento */}
                {isModalOpen && selectedAchievement && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 relative animate-in slide-in-from-bottom duration-300">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            {/* Conquista Preview */}
                            <div className="text-center mb-6">
                                <div className={`w-16 h-16 bg-gradient-to-r ${selectedAchievement.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4`}>
                                    {selectedAchievement.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{selectedAchievement.title}</h3>
                                <p className="text-gray-400">{selectedAchievement.description}</p>
                            </div>

                            {/* Botões de Compartilhamento */}
                            <div className="space-y-3">
                                <h4 className="text-white font-semibold mb-4 text-center">Compartilhar em:</h4>

                                <button
                                    onClick={() => shareToLinkedIn(selectedAchievement)}
                                    className="w-full flex items-center justify-center space-x-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors text-white font-medium"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    <span>LinkedIn</span>
                                    <ExternalLink className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => shareToTwitter(selectedAchievement)}
                                    className="w-full flex items-center justify-center space-x-3 p-3 bg-black hover:bg-gray-900 rounded-xl transition-colors text-white font-medium"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                    <span>X (Twitter)</span>
                                    <ExternalLink className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => shareToWhatsApp(selectedAchievement)}
                                    className="w-full flex items-center justify-center space-x-3 p-3 bg-green-600 hover:bg-green-700 rounded-xl transition-colors text-white font-medium"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                                    </svg>
                                    <span>WhatsApp</span>
                                    <ExternalLink className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => shareToInstagram(selectedAchievement)}
                                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-colors text-white font-medium"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <span>Instagram (Copiar texto)</span>
                                </button>

                                <button
                                    onClick={() => copyToClipboard(selectedAchievement)}
                                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-white font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    <span>Copiar texto</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareAchievements;