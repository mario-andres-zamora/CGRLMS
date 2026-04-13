import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useSoundStore } from '../store/soundStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export function useSurvey() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, updateUser } = useAuthStore();
    const { playSound } = useSoundStore();

    const [surveyData, setSurveyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
        const saved = localStorage.getItem(`survey_index_${id}`);
        return saved ? parseInt(saved) : 0;
    });
    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem(`survey_answers_${id}`);
        return saved ? JSON.parse(saved) : {};
    });
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [showIntro, setShowIntro] = useState(() => {
        const saved = localStorage.getItem(`survey_intro_${id}`);
        return saved === 'false' ? false : true;
    });

    useEffect(() => {
        localStorage.setItem(`survey_answers_${id}`, JSON.stringify(answers));
    }, [answers, id]);

    useEffect(() => {
        localStorage.setItem(`survey_index_${id}`, currentQuestionIndex.toString());
    }, [currentQuestionIndex, id]);

    useEffect(() => {
        fetchSurvey();
    }, [id]);

    const fetchSurvey = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/surveys/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setSurveyData(response.data);
                if (response.data.isCompleted) {
                    setCompleted(true);
                    setPointsEarned(response.data.survey.points || 0);
                }
            }
        } catch (error) {
            toast.error('Error al cargar la encuesta');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        setShowIntro(false);
        localStorage.setItem(`survey_intro_${id}`, 'false');
    };

    const handleAnswerChange = (questionId, value, type) => {
        if (completed) return;

        let answerObj = { ...answers[questionId] };

        if (type === 'multiple_choice') {
            answerObj = { optionId: value };
        } else if (type === 'rating') {
            answerObj = { text: value.toString() };
        } else if (type === 'text') {
            answerObj = { text: value };
        }

        setAnswers(prev => ({ ...prev, [questionId]: answerObj }));
    };

    const nextQuestion = () => {
        const currentQuestion = surveyData.questions[currentQuestionIndex];
        if (currentQuestion.is_required && !answers[currentQuestion.id]) {
            toast.error('Responde esta pregunta antes de continuar', { id: 'survey-answer-required' });
            return;
        }
        playSound('/sounds/next.mp3');
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const prevQuestion = () => {
        setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    };

    const handleSubmit = async () => {
        const unansweredRequired = surveyData.questions.filter(q => q.is_required && !answers[q.id]);
        if (unansweredRequired.length > 0) {
            toast.error('Por favor responde las preguntas obligatorias.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post(`${API_URL}/surveys/${id}/submit`, {
                answers
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCompleted(true);
                setPointsEarned(response.data.pointsAwarded || 0);

                localStorage.removeItem(`survey_answers_${id}`);
                localStorage.removeItem(`survey_index_${id}`);

                const currentUser = useAuthStore.getState().user;
                updateUser({
                    points: (currentUser?.points || 0) + (response.data.pointsAwarded || 0),
                    level: response.data.newLevel || currentUser?.level
                });

                toast.success('¡Gracias por tu retroalimentación!');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al enviar la encuesta');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        surveyData,
        loading,
        currentQuestionIndex,
        answers,
        submitting,
        completed,
        pointsEarned,
        showIntro,
        handleStart,
        handleAnswerChange,
        nextQuestion,
        prevQuestion,
        handleSubmit,
        setCurrentQuestionIndex,
        id,
        navigate
    };
}
