let lucky_number = Math.floor((Math.random() * 100)) + 1;
let attempts = 10;

// Get all the CSS rules.
const cssRules = document.styleSheets[0];

const main_container = document.querySelector('.main_container');
const answer = document.querySelector('.answer');
const attempts_counter = document.querySelector('.attempts_counter');
const feedback_img = document.querySelector('.feedback_img');
const feedback = document.querySelector('.feedback');

const check_btn = document.querySelector('.check_btn');
const hint_btn = document.querySelector('.hint_btn');
const reset_btn = document.querySelector('.reset_btn');
check_btn.addEventListener('click', check_answer);
hint_btn.addEventListener('click', show_hint);
reset_btn.addEventListener('click', () => window.location.reload());

const hint_list = document.querySelector('.hint_list');
const hints = [];
const previous_inputs_list = document.querySelector('.previous_inputs_list');
const previous_numbers = [];

const user_input = document.querySelector('.user_input');
const slide = document.querySelector('.slide');
user_input.addEventListener('input', check_if_in_range);
slide.addEventListener('input', () => user_input.value = slide.value);

function check_if_in_range() {
    const user_number = user_input.value;

	if (user_number != '') {
		if (user_number < 1) user_number = 1;
        if (user_number > 100) user_number = 100;
	}

    slide.value = user_number;
}

function check_answer() {
    const user_number = user_input.value;
    if(!user_number) {
        change_feedback_and_img('Please enter a number!', './icons/error.png');
        return;
    }
    
    // Prevent attempts from getting below 0
    if(attempts > 0) attempts_counter.innerText = --attempts;
    
    if(user_number != lucky_number) {
        user_number > lucky_number ? 
            change_feedback_and_img('Too High!', './icons/up_arrow.png') :
            change_feedback_and_img('Too Low!', './icons/down_arrow.png');

        add_to_history(user_number);

        if(attempts === 0) game_over(false);
        return;
    }
    
    if(user_number == lucky_number) {
        add_to_history(user_number);
        game_over(true);
    }
}

function change_feedback_and_img(text, img) {
    feedback.innerText = text;
    feedback_img.src = img;
}

function game_over(won) {
    user_input.disabled = true;
    check_btn.disabled = true;
    check_btn.style.cursor = 'default';
    answer.innerText = lucky_number;

    let custom_style;
    if(won) {
        change_feedback_and_img('You Got It Right!', './icons/congratulations.png');
        custom_style = {
            background: 'linear-gradient(-60deg, #0f3443, #34e89e, #186746, #124860)',
            "background-size": '400% 400%',
            animation: 'game_over 6s ease-in-out infinite'
        }
    }
    else {
        change_feedback_and_img('You Failed!', './icons/sad_face.png');
        custom_style = {
            background: 'linear-gradient(-60deg, #2a2929b6, #444648, #65696c, #2d2b2b)',
            "background-size": '400% 400%',
            animation: 'game_over 6s ease-in-out infinite'
        }
    }

    const game_over_keyframe = `
        @keyframes game_over {
            0% {
                background-position: 0 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0 50%;
            }
        }`;

    cssRules.insertRule(game_over_keyframe);
    Object.assign(main_container.style, custom_style);
}

function show_hint() {
    let list_item = document.createElement('li');
    let hint = document.createElement('h5');
    list_item.append(hint);

    if(!hints[0]) {
        hint.innerText = 'Did you know you could use binary search for this game?';
    }
    else if(!hints[1]) {
        lucky_number % 2 == 0 ? 
            hint.innerText = "It's an even number.":
            hint.innerText = "It's an odd number.";
    }
    else {
        let digit_sum = 0;
        let copy_of_lucky_number = lucky_number;

        while(copy_of_lucky_number > 0) {
            digit_sum = digit_sum + (copy_of_lucky_number % 10);
            copy_of_lucky_number = Math.floor(copy_of_lucky_number / 10);
        }

        hint.innerText = `The sum of the digit(s) of this number is ${digit_sum}.`;
        hint_btn.disabled = true;
        hint_btn.style.cursor = 'default';
    }

    hints.push(hint);
    hint_list.append(list_item);
}

function add_to_history(user_number) {
    if(previous_numbers.includes(user_number)) {
        change_feedback_and_img("You've tried this number before!", './icons/caution.png')
    }
    previous_numbers.push(user_number);

    let previous_number = document.createElement('li')
    previous_number.innerText = user_number;
    previous_inputs_list.append(previous_number);
}