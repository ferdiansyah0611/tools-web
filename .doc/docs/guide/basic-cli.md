---
title: Basic CLI
---

# Basic CLI :robot:

This section will explain about the basic commands in using tools-web

## Basic Command

Help the command.

```bash
help
```

Exit the command.

```bash
exit
```

You can run more command on system. Example:

```bash
dir
```

::: tip Completion
Just type char like `v` -> tabs, then type `[` or `]` to next and previous filter command.

Or write `[` or `]` to find all command.
:::

## System Command

This command is related to the system. Such as packages, namespaces, projects and others.

```bash
tw active myapp # current project
tw root C:/User/Ferdi/Project # namespace
tw mode p # development/production
tw update # upgrading to latest version
twx off name # disable package
twx on name # enable package
twx install name # install package
twx uninstall name # uninstall package
twp install name # install repository
twp uninstall name # uninstall repository
```

## Tools Command

Commonly used commands.

- **Start command**
  ```bash
  tools -h
  ```
- **Run prettier in the current project**
  ```bash
  tools prettier:all
  ```
- **Commit any files & push to repository**
  ```bash
  tools git:automate origin main
  ```