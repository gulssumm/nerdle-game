document.addEventListener('DOMContentLoaded', function () {
    const answers = [
        '8*7-47=9',
        '8*7-49=7',
        '9*20=180',
        '100/5=20',
        '50+49=99',
        '2*5+4=14'
    ];
    const randomIndex = Math.floor(Math.random() * answers.length);
    const randomEquation = answers[randomIndex];
    console.log(randomEquation);

    let attempts = 0;

    const gridForm = document.getElementById('grid-form');
    const guessList = document.getElementById('guesses');

    // Generate the grid with inputs
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.classList.add('col', 'grid-cell');
            cell.maxLength = 1; // Set max length of input to 1 character
            cell.required = true; // Input is required
            cell.addEventListener('input', updateButtonColors); // Add event listener to update button colors
            row.appendChild(cell);
        }
        gridForm.appendChild(row);
    }

    function isValidGuess(guess) {
        const parts = guess.split('=');
        if (parts.length !== 2) {
            return false;
        }
        const equation = parts[0].trim();
        const expectedValue = parts[1].trim();
        try {
            const actualValue = eval(equation);
            return actualValue === parseFloat(expectedValue);
        } catch (error) {
            return false;
        }
    }

    const buttons = document.querySelectorAll('#equation-buttons button');
    buttons.forEach(button => {
        button.addEventListener('click', function (event) {
            const buttonValue = event.target.textContent;
            const entryInput = document.getElementById('equation-entry');
            entryInput.value += buttonValue;
            updateButtonColors(); // Update button colors when a button is clicked
        });
    });

    function updateButtonColors() {
        const gridCells = document.querySelectorAll('.grid-cell');
        const inputValues = Array.from(gridCells).map(cell => cell.value).join('');
        console.log('Input Values:', inputValues); // Log inputValues
        const result = compareGuess(inputValues, randomEquation);
        console.log('Comparison Result:', result); // Log result
        
        // Get characters in the correct spot and their values
        const correctCharacters = result.characters.filter(char => char.state === 'correct').map(char => char.value);
        
        // Get characters in the wrong spot and their values
        const wrongSpotCharacters = result.characters.filter(char => char.state === 'wrongSpot').map(char => char.value);
        
        buttons.forEach(button => {
            const buttonValue = button.textContent;
            if (correctCharacters.includes(buttonValue)) {
                button.classList.add('green');
                button.classList.remove('purple');
            } else if (wrongSpotCharacters.includes(buttonValue)) {
                button.classList.add('purple');
                button.classList.remove('green');
            } else {
                button.classList.remove('purple');
                button.classList.remove('green');
            }
        });
    }

    function handleEnterButtonClick() {
        const entryInput = document.getElementById('equation-entry');
        const inputValue = entryInput.value.trim();
        console.log('Input Value:', inputValue); // Log the input value
        // You can perform any action with the input value here
    }
    
    // Select the Enter button
    const enterButton = document.getElementById('enter');
    // Add event listener to Enter button
    enterButton.addEventListener('click', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
    });

    // Select the delete button
    const deleteButton = document.getElementById('delete');

    // Add event listener to delete button
    deleteButton.addEventListener('click', function() {
        // Get the equation entry input
        const entryInput = document.getElementById('equation-entry');
        // Get the current value of the input
        let currentValue = entryInput.value;
        // Remove the last character from the input value
        currentValue = currentValue.slice(0, -1);
        // Update the input value
        entryInput.value = currentValue;
        // Update button colors after deleting a character
        updateButtonColors();
    });


    function displayGuess(guess, result) {
        if (guessList) {
            const guessItem = document.createElement('li');
            guessItem.textContent = guess + ' (Row: ' + attempts + ')' + (result.correct ? ' - Correct!' : '');
            guessList.appendChild(guessItem);
        }
    }
    
    document.getElementById('control-button').addEventListener('click', function () {
        const guess = document.getElementById('equation-entry').value.trim();

        if (isValidGuess(guess)) {
            attempts++;

            const result = compareGuess(guess, randomEquation);

            updateGridWithGuess(guess);
            displayGuess(guess, result);
            displayCharacterStates(result);

            if (result.correct) {
                message.textContent = 'Congratulations! You guessed the equation!';
                disableGridInputs();
                checkButton.disabled = true;
            } else if (attempts >= 6) {
                message.textContent = 'Game over, you lost. The correct equation was: ' + randomEquation;
                disableGridInputs();
                checkButton.disabled = true;
            }

        } else {
            alert('Invalid guess. Please enter a valid equation.');
        }
    });

    function updateGridWithGuess(guess) {
        const rows = document.querySelectorAll('.row');
        const currentRow = attempts % rows.length;
        const row = rows[currentRow];
        const gridCells = row.querySelectorAll('.grid-cell');
        const characters = guess.split('');
        characters.forEach((char, index) => {
            if (index < gridCells.length) {
                gridCells[index].value = char;
            }
        });
    }


    function compareGuess(guess, answer) {
        const result = { correct: guess === answer, characters: [] };
        const maxLength = Math.max(guess.length, answer.length);
        for (let i = 0; i < maxLength; i++) {
          const guessChar = guess[i];
          const answerChar = answer[i];
          if (!guessChar || !answerChar) {
            // If one of the strings ends, mark remaining characters in the guess as 'wrong'
            for (let j = i; j < maxLength; j++) {
              result.characters.push({ value: guess[j], state: 'wrong' });
            }
            break;
          }
          
          // Check for digits (0-9)
          if (!isNaN(parseInt(guessChar)) && !isNaN(parseInt(answerChar))) {
            if (guessChar === answerChar) {
              result.characters.push({ value: guessChar, state: 'correct' });
            } else if (answer.includes(guessChar) && guessChar !== answerChar) {
              result.characters.push({ value: guessChar, state: 'wrongSpot' });
            } else {
              result.characters.push({ value: guessChar, state: 'wrong' });
            }
          // Check for operators and equal sign
          } else {
            if (guessChar === answerChar) {
              result.characters.push({ value: guessChar, state: 'correct' });
            } else if (answer.includes(guessChar) && guessChar !== answerChar) {
                result.characters.push({ value: guessChar, state: 'wrongSpot' });
            }else {
              result.characters.push({ value: guessChar, state: 'wrong' });
            }
          }
        }
        return result;
      }
      
    
      function displayCharacterStates(result) {
        const rows = document.querySelectorAll('.row');
        const currentRow = attempts % rows.length;
        const rowCells = rows[currentRow].querySelectorAll('.grid-cell');
        const minLength = Math.min(result.characters.length, rowCells.length); // Ensure we iterate over the minimum of the two lengths
        for (let i = 0; i < minLength; i++) {
            const cell = rowCells[i];
            const charState = result.characters[i].state;
            cell.classList.remove('correct', 'wrongSpot', 'wrong', 'invalid');
            if (charState === 'correct') {
                cell.classList.add('correct');
            } else if (charState === 'wrongSpot') {
                cell.classList.add('wrongSpot');
            } else if (charState === 'wrong') {
                cell.classList.add('wrong');
            } else if (charState === 'invalid') {
                cell.classList.add('invalid');
            }
        }
    }
    

    function disableGridInputs() {
        const gridInputs = document.querySelectorAll('.grid-cell');
        gridInputs.forEach(input => {
            input.disabled = true;
        });
    }
});
