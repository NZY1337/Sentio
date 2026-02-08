import { useNotifications } from '@toolpad/core';

// types 
import type { BuilderOptionsProps } from "../types";

// utils
import { CHARS_LIMIT } from "../helpers/constants";

const useBuilderPrompt = ({ builderState, setBuilderState, setCharCount }: Pick<BuilderOptionsProps, 'builderState' | 'setBuilderState'> & { setCharCount: React.Dispatch<React.SetStateAction<number>> }) => {
    const notifications = useNotifications();

    const updatePrompt = (newPrompt: string) => {
        setBuilderState((prev) => ({ ...prev, prompt: newPrompt }));
        setCharCount(newPrompt.length);
    };

    const notifier = () => {
        notifications.show('You have reached the 500 character limit.', {
            severity: 'warning',
            autoHideDuration: 2000,
        });
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length >= 500) notifier();
        updatePrompt(value);
    };

    const handleClickCategory = (value: string) => {
        const newPrompt = builderState.prompt ? `${builderState.prompt}, ${value}` : value;
        
        if (newPrompt.length > CHARS_LIMIT) {
            notifier();
            return;
        }

        updatePrompt(newPrompt);
    };


    const handleGenerateBaseDesign = () => {
        if (!builderState.designTheme || !builderState.spaceType) return;
        
        const roomName = builderState.spaceType.toLowerCase().replace(/_/g, ' ');
        const styleName = builderState.designTheme.toLowerCase().replace(/_/g, ' ');
        
        const newBasePrompt = `A beautiful ${styleName} ${roomName} interior design, professional photography, high-end furniture, elegant lighting, spacious layout, premium materials`;
        
        // Extract any existing manual additions by removing the old base prompt pattern
        let manualAdditions = '';
        if (builderState.prompt) {
            // Match any base prompt pattern and extract what comes after it
            const basePromptPattern = /^A beautiful .* interior design, professional photography, high-end furniture, elegant lighting, spacious layout, premium materials/;
            const match = builderState.prompt.match(basePromptPattern);
            
            if (match) {
                // Get everything after the base prompt
                manualAdditions = builderState.prompt.substring(match[0].length);
                // Clean up leading comma and space
                manualAdditions = manualAdditions.replace(/^,\s*/, '');
            } else {
                // If no base prompt pattern found, treat the whole thing as manual additions
                manualAdditions = builderState.prompt;
            }
        }
        
        // Combine new base prompt with existing manual additions
        const finalPrompt = manualAdditions ? `${newBasePrompt}, ${manualAdditions}` : newBasePrompt;
        updatePrompt(finalPrompt);
    };

    return { 
        handleClickCategory, 
        handleGenerateBaseDesign,
        handlePromptChange
    };
}

export default useBuilderPrompt;