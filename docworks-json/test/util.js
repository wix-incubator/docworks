import trimEnd from 'lodash.trimend';

export function stripMargin(string) {
    return string.split('\n')
        .map(line => {
            let parts = line.split('|');
            return (parts.length == 2)?parts[1]: parts[0]
        })
        .map(trimEnd)
        .join('\n');
}