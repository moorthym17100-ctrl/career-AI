document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('resume');
    const fileDropArea = document.getElementById('file-drop-area');
    const fileNameDisplay = document.getElementById('file-name');
    const form = document.getElementById('resume-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('span');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-message');
    const resultsSection = document.getElementById('results-section');
    const skillsContainer = document.getElementById('skills-container');
    const opportunitiesBody = document.getElementById('opportunities-body');

    // API URL
    const API_URL = 'http://127.0.0.1:5001/api/upload-resume';

    // File Drop Area Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => fileDropArea.classList.add('is-active'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => fileDropArea.classList.remove('is-active'), false);
    });

    fileDropArea.addEventListener('drop', (e) => {
        let dt = e.dataTransfer;
        let files = dt.files;
        if(files.length) {
            fileInput.files = files;
            updateFileName(files[0].name);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if(fileInput.files.length) {
            updateFileName(fileInput.files[0].name);
        }
    });

    function updateFileName(name) {
        fileNameDisplay.textContent = name;
    }

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!fileInput.files.length) {
            showError("Please select a file to upload.");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('resume', file);

        // UI State: Loading
        setLoading(true);
        hideError();
        resultsSection.classList.add('hidden');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            let data;
            try {
                data = await response.json();
            } catch (err) {
                throw new Error("Invalid response from server. Is the Flask server running?");
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process resume');
            }

            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || "An error occurred connecting to the server. Make sure the Flask server is running on port 5001.");
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.style.opacity = '0';
            loader.style.display = 'block';
        } else {
            btnText.style.opacity = '1';
            loader.style.display = 'none';
        }
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }

    function hideError() {
        errorMsg.classList.add('hidden');
    }

    function displayResults(data) {
        const { extracted_skills, opportunities } = data;
        
        // Render Skills
        skillsContainer.innerHTML = '';
        if (!extracted_skills || extracted_skills.length === 0) {
            skillsContainer.innerHTML = '<p style="color: var(--text-secondary)">No specific known skills extracted. Ensure your resume contains common technical skills.</p>';
        } else {
            extracted_skills.forEach((skill, index) => {
                const span = document.createElement('span');
                span.className = 'skill-tag';
                span.textContent = skill;
                span.style.animationDelay = `${index * 0.1}s`;
                skillsContainer.appendChild(span);
            });
        }

        // Render Opportunities
        opportunitiesBody.innerHTML = '';
        if (!opportunities || opportunities.length === 0) {
            opportunitiesBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No matched opportunities found.</td></tr>';
        } else {
            opportunities.forEach((opp, index) => {
                const tr = document.createElement('tr');
                tr.className = 'opp-row';
                tr.style.animationDelay = `${index * 0.1}s`;

                // Type badge
                const typeClass = opp.job_type === 'internship' ? 'type-internship' : 'type-full-time';
                
                // Score formatting
                let scoreClass = 'score-low';
                if (opp.match_score >= 70) scoreClass = 'score-high';
                else if (opp.match_score >= 40) scoreClass = 'score-med';

                // Required skills HTML
                const reqSkillsHtml = opp.required_skills.map(skill => {
                    const isMatched = extracted_skills.includes(skill);
                    return `<span class="req-skill-tag ${isMatched ? 'matched' : ''}">${skill}</span>`;
                }).join('');

                tr.innerHTML = `
                    <td><strong>${opp.company}</strong></td>
                    <td>${opp.role}</td>
                    <td><span class="type-badge ${typeClass}">${opp.job_type}</span></td>
                    <td><span class="score-badge ${scoreClass}">${opp.match_score}%</span></td>
                    <td><div class="req-skills">${reqSkillsHtml}</div></td>
                `;
                opportunitiesBody.appendChild(tr);
            });
        }

        // Show results
        resultsSection.classList.remove('hidden');
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
});
