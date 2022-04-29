export interface WorkspaceStatistics {
    total: {
        incidentsCount: number,
        incidentsOccurCount: number,
    },
    release: {
        version: string,
        incidentsCount: number,
        incidentsOccurCount: number,
    }
}