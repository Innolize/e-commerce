export interface IRamQuery{
    ram_version?: "DDR1" | "DDR2" | "DDR3" | "DDR4",
    min_frec?: number,
    max_frec?: number,
}