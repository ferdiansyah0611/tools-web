import { output, program } from "../../lib.js";
import { execute } from "../../utils/execute.js";
import config from "../../utils/config.js";
import { file } from "../../utils/file.js";
import { join } from "path";

program
  .command("laravel new", "Create Laravel Project (Official)")
  .argument("name", "name of project")
  .action(laravelNew)

  .command("laravel add:filament", "Project integration with Filament")
  .action(addFilament)

  .command("laravel add:livewire", "Project integration with Livewire")
  .action(addLivewire)

  .command("spatie add:permission", "Project integration with Spatie Permission")
  .action(addSpatiePermission)
  .command("spatie add:medialibrary", "Project integration with Spatie Media Library")
  .action(addSpatieMediaLibrary)
  .command("spatie add:querybuilder", "Project integration with Spatie Query Builder")
  .action(addSpatieQueryBuilder);

export function laravelNew({ args }: any) {
  const name = args.name || config.value.app_active;
  const sub = execute(
    `cd ${config.value.app_path} && composer global require laravel/installer && laravel new ${name} && cd ${name}`,
    {
      background: true,
    },
  );
  sub.doRun();
}

export function addFilament() {
  let cli = `cd ${config.pathApp[0]}`;
  cli += ' && composer require filament/filament:"^3.2" -W';
  cli += ' && composer require filament/forms:"^3.2" -W';
  cli += ' && composer require filament/tables:"^3.2" -W';
  cli += ' && composer require filament/notifications:"^3.2" -W';
  cli += ' && composer require filament/actions:"^3.2" -W';
  cli += ' && composer require filament/infolists:"^3.2" -W';
  cli += ' && composer require filament/widgets:"^3.2" -W';
  cli += " && php artisan filament:install --panels";
  cli += " && php artisan filament:install --forms";
  cli += " && php artisan filament:install --tables";
  cli += " && php artisan filament:install --notifications";
  cli += " && php artisan filament:install --actions";
  cli += " && php artisan filament:install --infolists";
  cli += " && php artisan filament:install --widgets";
  cli += " && npm i && npm run dev";

  const sub = execute(cli, {
    background: true,
  });
  sub.doRun();

  output.log(
    `don't forget to setup database and create user with 'php artisan make:filament-user'`,
  );
}

export function addLivewire() {
  const sub = execute(
    `cd ${config.pathApp[0]} && composer require livewire/livewire`,
    {
      background: true,
    },
  );
  sub.doRun();
}

export function addDebugBar() {
  const sub = execute(
    `cd ${config.pathApp[0]} && composer require barryvdh/laravel-debugbar --dev`,
    {
      background: true,
    },
  );
  sub.doRun();
}

export function addSpatiePermission() {
  const dir = config.pathApp[0];
  const sub = execute(
    `cd ${dir} && composer require spatie/laravel-permission`,
    {
      background: true,
    },
  );
  sub.doRun();
  file.append(join(dir, "/app/Models/User.php"), "", "", (text) =>
    text.replace("use ", "use HasRoles, "),
  );
}

export function addSpatieMediaLibrary() {
  const sub = execute(
    `cd ${config.pathApp[0]} && composer require spatie/laravel-medialibrary && php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-migrations" && php artisan migrate`,
    {
      background: true,
    },
  );
  sub.doRun();
  output.log(`for custom config file, run:`)
  output.log(`php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-config"`)
}

export function addSpatieQueryBuilder() {
  const sub = execute(
    `cd ${config.pathApp[0]} && composer require spatie/laravel-query-builder`,
    {
      background: true,
    },
  );
  sub.doRun();
}