export interface ShortcutCommandsProps {
    code: string;
}
const ShortcutCommands = ({ code }: ShortcutCommandsProps) => {
    return (
        <p className="text-sm text-muted-foreground">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>
                {code}
            </kbd>
        </p>
    );
};

export default ShortcutCommands;
