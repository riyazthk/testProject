import * as Yup from 'yup';

const numberValidation = new RegExp(/^[0-9]{10}$/);
const nameValidation = new RegExp(/^[^\s*]{1,}[a-zA-Z0-9-_/.\s*]{1,}$/);
const addressValidation = new RegExp(/^[^]{1,}[a-zA-Z0-9-/.:,]{1,}$/);
const valueValidation = new RegExp(/^[^0]{1,}[0-9]{0,8}(.[0-9]{1,3})?$/);

export const SignInSchema = (lan_val_keys) =>
  Yup.object({
    user_name: Yup.string()
      .required('Please enter your user name')
      .matches(nameValidation, 'User name is not valid'),
    password: Yup.string().required('Please enter your password').min(6),
  });

export const PostSchema = () =>
  Yup.object({
    title: Yup.string()
      .required('Please enter your user name')
      .matches(nameValidation, 'Title is not valid'),
    website: Yup.string().required('Please enter your password'),
    description: Yup.string().required('Please enter your description'),
  });
