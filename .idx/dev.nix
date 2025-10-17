{ pkgs, ... }: {
  # Add Nix packages here
  # Lists in Nix are space-separated, not comma-separated.
  packages = [
    pkgs.nodejs_20
    pkgs.firebase-tools
    pkgs.python3
  ];

  # The global env block is not used for the service account to avoid build issues.
  env = {};

  # Add VS Code extensions
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];

    workspace = {
      # Commands to run on workspace creation
      onCreate = {
        install-functions-deps = "npm install --prefix agileflow/functions";
        install-usr-functions-deps = "npm install --prefix agileflow/usr/src/app/functions";
        install-frontend-deps = "npm install --prefix agileflow/src";
      };

      # onStart is removed to prevent emulators from starting automatically
      onStart = {};
    };

    # Configure web previews
    previews = {
      enable = true;
      previews = {
        web = {
          # We inject the environment variables directly into the command that runs the
          # dev server. This is more reliable than using the global `env` block.
          command = [
            "env"
            "GOOGLE_APPLICATION_CREDENTIALS=/workspace/.secret/gcp-sa-key.json"
            "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAk1sXBhKN58lj0aZxwFcmp-F0bGPoEYSc"
            "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agileflow-mlf18.firebaseapp.com"
            "NEXT_PUBLIC_FIREBASE_PROJECT_ID=agileflow-mlf18"
            "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agileflow-mlf18.firebasestorage.app"
            "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=503172782024"
            "NEXT_PUBLIC_FIREBASE_APP_ID=1:503172782024:web:a925bbac9fd802c28512fd"
            "npm"
            "--prefix"
            "agileflow/src"
            "run"
            "dev"
            "--"
            "--port"
            "$PORT"
            "--hostname"
            "0.0.0.0"
          ];
          manager = "web";
        };
      };
    };
  };
}
