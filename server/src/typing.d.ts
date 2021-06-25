declare module 'interpolate-json' {
    export namespace interpolation {
        function expand(target: string | json, values: json): json
    }
}

