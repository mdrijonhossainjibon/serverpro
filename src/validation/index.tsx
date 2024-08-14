import Validator from 'validator';
import isEmpty from 'is-empty';

interface LoginInput {
    username: string;
    password: string;
}

interface ValidationResult {
    errors: {
        name?: string;
        username?: string;
        password?: string;
        password2?: string;
        email?: string;
    };
    isValid: boolean;
}

export const validateLoginInput = (data: Partial<LoginInput>): ValidationResult => { 
    let errors: ValidationResult['errors'] = {};

    // Converts empty fields to String in order to validate them
    data.username = !isEmpty(data.username) ? data.username! : '';
    data.password = !isEmpty(data.password) ? data.password! : '';

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    } else if (!Validator.isEmail(data.username)) {
        errors.username = 'Username must be a valid email';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    } else if (!Validator.isStrongPassword(data.password, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        errors.password = 'Password must include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

interface RegisterInput {
    name: string;
    username: string;
    password: string;
    password2: string;
}

export default function validateRegisterInput(data: Partial<RegisterInput>): ValidationResult {
    let errors: ValidationResult['errors'] = {};

    // Converts empty fields to String in order to validate them
    data.name = !isEmpty(data.name) ? data.name! : '';
    data.username = !isEmpty(data.username) ? data.username! : '';
    data.password = !isEmpty(data.password) ? data.password! : '';
    data.password2 = !isEmpty(data.password2) ? data.password2! : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    } else if (!Validator.isEmail(data.username)) {
        errors.username = 'Username must be a valid email';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters';
    } else if (!Validator.isStrongPassword(data.password, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        errors.password = 'Password must include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is required';
    } else if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}
