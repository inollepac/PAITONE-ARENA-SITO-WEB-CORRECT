
import { GoogleGenAI } from "@google/genai";
import { SiteConfig } from "../types";

export const getChatbotResponse = async (userMessage: string, config: SiteConfig) => {
  // Use API key directly from process.env as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Sei l'assistente virtuale di "${config.centerName}".
    Tono: Amichevole, umano, accogliente, mai robotico.
    Informazioni Centro:
    - Indirizzo: ${config.address}
    - Orari: ${config.workingHours}
    - WhatsApp: ${config.whatsapp}
    - Email: ${config.email}
    
    Obiettivi:
    1. Aiutare gli utenti a prenotare (indirizzali al pulsante "Prenota" o spiega come fare).
    2. Rispondere a info su corsi e tornei.
    3. Promuovere la socialità e il relax.
    
    Rispondi in modo conciso e usa le emoji per essere cordiale.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Scusa, non ho capito. Posso aiutarti con la prenotazione?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ciao! Al momento ho qualche difficoltà tecnica, ma puoi scriverci su WhatsApp per qualsiasi info!";
  }
};
