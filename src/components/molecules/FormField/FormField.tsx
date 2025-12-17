import { Input } from '@/components/atoms/Input';
import { Select, type SelectOption } from '@/components/atoms/Select';
import { Checkbox } from '@/components/atoms/Checkbox';
import { cn } from '@/lib/utils';

interface BaseFormFieldProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
}

interface TextFormFieldProps extends BaseFormFieldProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'ghost';
  selectSize?: 'sm' | 'md' | 'lg';
}

interface CheckboxFormFieldProps extends BaseFormFieldProps {
  type: 'checkbox';
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'default' | 'primary' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

type FormFieldProps = TextFormFieldProps | SelectFormFieldProps | CheckboxFormFieldProps;

export function FormField(props: Readonly<FormFieldProps>) {
  const { name, label, error, required, disabled, className, helperText, type } = props;

  const renderField = () => {
    switch (type) {
      case 'select': {
        const selectProps = props as SelectFormFieldProps;
        return (
          <Select
            id={name}
            name={name}
            label={label}
            error={error}
            required={required}
            disabled={disabled}
            value={selectProps.value}
            onChange={selectProps.onChange}
            options={selectProps.options}
            placeholder={selectProps.placeholder}
            variant={selectProps.variant}
            selectSize={selectProps.selectSize}
          />
        );
      }
      case 'checkbox': {
        const checkboxProps = props as CheckboxFormFieldProps;
        return (
          <Checkbox
            id={name}
            name={name}
            label={label}
            error={error}
            required={required}
            disabled={disabled}
            checked={checkboxProps.checked}
            onChange={checkboxProps.onChange}
            variant={checkboxProps.variant}
            size={checkboxProps.size}
          />
        );
      }
      default: {
        const inputProps = props as TextFormFieldProps;
        return (
          <Input
            id={name}
            name={name}
            type={type}
            label={label}
            error={error}
            required={required}
            disabled={disabled}
            value={inputProps.value}
            onChange={inputProps.onChange}
            placeholder={inputProps.placeholder}
            variant={inputProps.variant}
            inputSize={inputProps.inputSize}
          />
        );
      }
    }
  };

  return (
    <div data-component="FormField" className={cn('w-full', className)}>
      {renderField()}
      {helperText && !error && (
        <p
          data-component="FormField.HelperText"
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

