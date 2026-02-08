import { FormControl, FormLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

export interface DynamicSelectProps {
    label: string;
    id: string;
    name: string;
    value: string | number;
    options: string[] | undefined;
    keys: string[] | undefined;
    onChange: (
        event:
            | SelectChangeEvent<string | number>
            | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({
    label,
    id,
    name,
    value,
    options = [],
    keys = [],
    onChange,
}) => {
    return (
        <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }} htmlFor={id}>{label}</FormLabel>
            <Select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                sx={{ svg: { color: "grey.500" } }}
            >
                {options.map((option, index) => (
                    <MenuItem key={keys[index]} value={keys[index]}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DynamicSelect;
