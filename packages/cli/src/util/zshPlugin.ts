import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const text = `model=(
  #{models}
)
function listPalGCompletions {
  if [[ #{#words[@]} == 2 ]]; then
    reply=(
      generate
      create
      schema
      -h --help
      -v --version
    )
  else
    case $words[2] in
    generate | g)
      reply=(
          # options
          -h --help
          -c --config
          -s --schema
          -m --multi
          -a --autoComplete

          # models
          $model

          # completions
          crud
          queries
          mutations
          admin
          graphql
        )
      ;;
    schema | s)
      if [[ $words[3] == 'json' ]]; then
        reply=(
          -o --output-path
          -t --type
          -s --scheam
        )
      elif [[ $words[3] == 'typescript' ]]; then
        reply=(
          -o --output-path
          -s --scheam
        )
      elif [[ $words[3] == 'camel-case' ]]; then
        reply=(
          -s --scheam
        )
      else
        reply=(
          typescript
          camel-case
          json
        )
      fi
      ;;
    esac
  fi
}

compctl -K listPalGCompletions pal
`;

export default function createPlugin(models: string[], path: string) {
  const fileContent = text
    .replace(/#{models}/g, models.join('\n  '))
    .replace('#{#words[@]}', '${#words[@]}');
  const completePath = join(path, 'pal');
  !existsSync(completePath) && mkdirSync(completePath, { recursive: true });
  writeFileSync(join(completePath, 'pal.plugin.zsh'), fileContent);
}