# Command line mail-merge utility

This tool provides a command-line mail-merge utility for sending mails to one or more
recipients, running them through templates, etc.

## Installing

    npm install -g mdekstrand/mailmerge

## Running

The entry point is `mailmerge-send`:

    mailmerge-send [OPTIONS] message.txt [RECIPIENTS]

It takes a few options:

`--sendmail path`
:   Specify the name or path to the `sendmail` binary to use.

`--server url`
:   In lieu of `--sendmail`, specifies the URL for an SMTP server to use (e.g. `smtp://user@pass:host:587`)

`--recipients file`
:   Read the recipients from the file specified. Each line should be a JSON object with a `to` attribute.
    Other attributes will be available as variables in the message templates.

It takes one mandatory argument, the path to a message file.  This should be a text file with YAML frontmatter.  Other arguments are used as recipient e-mail addresses.  The frontmatter should include a `subject` entry.  Both the `subject` and the message body will be interpreted as Mustache templates, with the frontmatter and the recipient variables available (recipient variables override frontmatter variables).

## Example Message

```
---
subject: Call for Paper Airplanes
from: me@example.org
reply-to: reply-recipient@example.org
---

Greetings!

The International Conference on Makeshift Aviation is pleased to invite submissions of
paper airplanes for its third international paper airplane demo session.

Regards,
The Publicity Chairs
```

## Contributing and Extending

`mailmerge` uses nodemailer, so adding support for additional transports such as GMail would not be difficult.

Bug-fixes, improvements, and more documentation welcome.
