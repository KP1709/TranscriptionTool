export type LoggerEntry = {
    message: string;
    secondary?: string[];
};

type Listener = (logs: LoggerEntry[]) => void;

class Logger {
    private logs: LoggerEntry[] = [];
    private listeners = new Set<Listener>();

    private notifyListeners(snapshot: LoggerEntry[]) {
        queueMicrotask(() => {
            for (const listener of this.listeners) {
                listener([...snapshot]);
            }
        });
    }

    log(message: string, secondary?: string | string[]) {
        const entry: LoggerEntry = { message };

        if (secondary) {
            entry.secondary = Array.isArray(secondary) ? secondary : [secondary];
        }

        this.logs = [...this.logs, entry];
        this.notifyListeners(this.logs);
    }

    logSecondary(message: string) {
        this.log(message);
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);

        // Send current logs on the next microtask so React won't try to update
        // a mounted logger subscriber while another component is still rendering.
        this.notifyListeners(this.logs);

        return () => {
            this.listeners.delete(listener);
        };
    }
}

export const logger = new Logger();