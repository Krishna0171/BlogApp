import {
    IconButton,
    InputAdornment,
    TextField,
    type TextFieldProps,
  } from '@mui/material';
  import { Visibility, VisibilityOff } from '@mui/icons-material';
  import { useState } from 'react';
  
  type Props = TextFieldProps & {
    label?: string;
  };
  
  const PasswordInput = ({ label = 'Password', ...rest }: Props) => {
    const [showPassword, setShowPassword] = useState(false);
  
    return (
      <TextField
        {...rest}
        label={label}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  };
  
  export default PasswordInput;
  