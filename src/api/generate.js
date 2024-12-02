export async function generateBountyIdea(prompt) {
  try {
    const response = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate bounty');
    }

    const data = await response.json();
    
    return {
      title: data.title,
      description: data.description
    };
  } catch (error) {
    console.error('Error generating bounty idea:', error);
    throw error;
  }
}
