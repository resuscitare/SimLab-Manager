<Input
          id={`${param.key}-${frame.id}`}
          type={param.unit === '%' || param.key === 'ph' ? "number" : "text"}
          min={param.unit === '%' ? 0 : undefined}
          max={param.unit === '%' ? 100 : undefined}
          step={param.key === 'ph' ? 0.01 : undefined}
          value={value || ''}
          onChange={(e) => onUpdate(param.key, e.target.value)}
          className="pr-12"
        />