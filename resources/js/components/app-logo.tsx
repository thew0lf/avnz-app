import AppLogoIcon from './app-logo-icon';
import { useEffect, useState } from 'react';

type Project = {
    id: number;
    name: string;
    display_name: string;
};

export default function AppLogo() {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch('/api/project'); // Replace with actual API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }
                const data: Project = await response.json();
                setProject(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProject();
    }, []);

    return (
        <>
            <div
                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md"
            >
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-none font-semibold">
          {project ? <span>{project.display_name?project.display_name:project.name}</span> : <span>No project available</span>}
        </span>
            </div>
        </>
    );
}
