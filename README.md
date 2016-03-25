# Command line mail-merge utility

This tool provides a command-line mail-merge utility for sending mails to one or more
recipients, running them through templates, etc.

## Installing

    npm install -g mdekstrand/mailmerge

## Running

The entry point is `mailmerge-send`.  It takes a few options:

`--sendmail path`
:   Specify the name or path to the `sendmail` binary to use.

`--recipients file`
:   Read the recipients from the file specified. Each line should be a JSON object with a `to` attribute.
    Other attributes will be available as variables in the message templates.

It takes one mandatory argument, the path to a message file.  This should be a text file with YAML frontmatter.
The frontmatter should include a `subject` entry.  Both the `subject` and the message body will be interpreted
as Mustache templates, with the frontmatter and the recipient variables available (recipient variables override
frontmatter variables).