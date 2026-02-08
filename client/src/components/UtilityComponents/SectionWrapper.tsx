import Container from '@mui/material/Container';
import { type Breakpoint } from '@mui/system';
import Typography from '@mui/material/Typography';
import { Grid } from "@mui/material";
import { type TypographyProps } from '@mui/material/Typography';

interface SectionWrapperInterface {
    children: React.ReactNode,
    innerWidth?: Breakpoint | false,
    outerWidth?: Breakpoint | false,
    title?: React.ReactNode,
    subtitle1?: React.ReactNode,
    subtitle2?: React.ReactNode,
    justify?: 'start' | 'center' | 'flex-end',
    sx?: object
}

interface TitleProps {
    children: React.ReactNode;
    variant?: TypographyProps['variant']; //default body1
}

interface SubtitleProps {
    children: React.ReactNode;
    variant?: TypographyProps['variant']; //default body1
}

const Title = ({ children, variant }: TitleProps) => {
    return (
        <Typography variant={variant} textAlign={"center"} sx={{ mb: 3, borderRadius: '8px' }}>
            {children}
        </Typography>
    );
};

const Subtitle = ({ children, variant }: SubtitleProps) => {
    return (
        <Typography variant={variant} textAlign={"left"} sx={{ mb: 3, borderRadius: '8px' }}>
            {children}
        </Typography>
    );
};

const SectionWrapper = ({
    children,
    innerWidth,
    outerWidth,
    title,
    subtitle1,
    subtitle2,
    justify = 'start',
    sx
}: SectionWrapperInterface) => {
    return (
        <Container maxWidth={outerWidth} sx={{ p: '6rem 0rem', ...sx }}>
            <Container maxWidth={innerWidth}>
                {title || subtitle1 || subtitle2 ? (
                    <Grid container justifyContent={justify} spacing={3}>
                        {title && <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                            {title}
                        </Grid>}

                        {subtitle1 && <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                            <SectionWrapper.Subtitle variant="body1">
                                {subtitle1}
                            </SectionWrapper.Subtitle>
                        </Grid>}

                        {subtitle2 && <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                            <SectionWrapper.Subtitle variant="body1">
                                {subtitle2}
                            </SectionWrapper.Subtitle>
                        </Grid>}
                    </Grid>
                ) : null}

                {children}
            </Container>
        </Container>
    )
}

SectionWrapper.Title = Title;
SectionWrapper.Subtitle = Subtitle;

export default SectionWrapper;