const fs = require('fs');

async function generate() {
    const mermaidGraph = `
erDiagram
    USERS ||--o{ INTERVIEWS : creates
    INTERVIEWS ||--o{ INTERVIEW_FEEDBACK : has
    
    USERS {
        string email PK
        string name
        string avatar_url
    }

    INTERVIEWS {
        uuid id PK
        string userEmail FK "Ref: users.email"
        string jobPosition
        string jobDesc
        string jobExperience
        jsonb questionList
        timestamp createdAt
    }

    INTERVIEW_FEEDBACK {
        uuid id PK
        uuid interview_id FK "Ref: interviews.id"
        string userEmail
        string userName
        jsonb feedback "Contains AI Rating & Answer Analysis"
        boolean recommended
        timestamp createdAt
    }
  `;

    try {
        const response = await fetch('https://kroki.io/mermaid/png', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: mermaidGraph
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync('C:/Users/HP/.gemini/antigravity/brain/191b6429-a8ed-4eca-b310-7ff17f35a351/er_diagram.png', Buffer.from(buffer));
        console.log("Diagram generated successfully!");
    } catch (e) {
        console.error(e);
    }
}

generate();
