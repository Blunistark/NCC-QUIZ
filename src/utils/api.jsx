// src/api.js (or wherever you have your API functions)
import supabase from './utils/supabase';  // Import Supabase client

export const getQuizData = async () => {
  try {
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*');
    
    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .select('*');
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*');

    if (questionError || topicError || userError) {
      throw new Error('Error fetching data');
    }

    return {
      totalQuestions: questionData.length,
      totalTopics: topicData.length,
      totalUsers: userData.length,
    };
  } catch (error) {
    console.error("Error fetching data", error);
    return {
      totalQuestions: 0,
      totalTopics: 0,
      totalUsers: 0,
    };
  }
};
